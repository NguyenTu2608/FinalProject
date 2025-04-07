package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.PasswordChangeRequest;
import com.example.chinesechess.model.Admin;
import com.example.chinesechess.model.User;
import com.example.chinesechess.security.JwtUtil;
import com.example.chinesechess.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    //get all admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return userService.getAllAdmins();
    }

    @PostMapping
    public ResponseEntity<String> createAdmin(@RequestBody Admin admin) {
        // Kiểm tra xem username có trống không
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username không được để trống!");
        }

        // Kiểm tra xem email có trống không
        if (admin.getEmail() == null || admin.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống!");
        }

        // Kiểm tra xem password có trống không
        if (admin.getPassword() == null || admin.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password không được để trống!");
        }

        String email = admin.getEmail().trim();
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return ResponseEntity.badRequest().body("Email không đúng định dạng!");
        }

        // Kiểm tra xem username đã tồn tại chưa
        Optional<Admin> existingAdminByUsername = Optional.ofNullable(userService.getAdminByUsername(admin.getUsername()));
        if (existingAdminByUsername.isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại!");
        }
        // Kiểm tra xem email đã tồn tại chưa
        Optional<Admin> existingAdminByEmail = Optional.ofNullable(userService.getAdminByEmail(admin.getEmail()));
        if (existingAdminByEmail.isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        // Nếu không có trùng lặp và các trường hợp trên đã được kiểm tra, lưu người dùng mới vào cơ sở dữ liệu
        userService.saveAdmin(admin);
        return ResponseEntity.ok("Người dùng đã được thêm thành công!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        Optional<Admin> admin = userService.getAdminById(id);
        return admin.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAdminFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }

        token = token.substring(7); // Bỏ "Bearer "

        if (!JwtUtil.verifyToken(token)) {
            return ResponseEntity.status(401).body("Token không hợp lệ hoặc đã hết hạn");
        }
        String email = JwtUtil.extractEmail(token); // Lấy email từ token
        Admin admin = userService.getAdminByEmail(email);

        return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.notFound().build();
    }

    //delete admin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String id) {
        if (userService.getAdminById(id).isPresent()) {
            userService.deleteAdmin(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/username/{username}")
    public ResponseEntity<Void> deleteAdminByUsername(@PathVariable String username) {
        try {
            userService.deleteAdminByUsername(username);  // Gọi dịch vụ xóa admin theo username
            return ResponseEntity.noContent().build();   // Trả về 204 No Content nếu xóa thành công
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();    // Trả về 404 Not Found nếu admin không tồn tại
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(HttpServletRequest request, @RequestBody PasswordChangeRequest passwordChangeRequest) {
        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Thiếu hoặc sai định dạng token");
        }

        token = token.substring(7); // Bỏ "Bearer "

        if (!JwtUtil.verifyToken(token)) {
            return ResponseEntity.status(401).body("Token không hợp lệ hoặc đã hết hạn");
        }

        String email = JwtUtil.extractEmail(token);
        Admin admin = userService.getAdminByEmail(email);

        if (admin == null) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), admin.getPassword())) {
            return ResponseEntity.status(403).body("Mật khẩu cũ không đúng");
        }

        // Kiểm tra xác nhận mật khẩu mới
        if (!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Xác nhận mật khẩu mới không khớp");
        }

        // Cập nhật mật khẩu mới
        admin.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userService.saveAdmin(admin);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }


}
