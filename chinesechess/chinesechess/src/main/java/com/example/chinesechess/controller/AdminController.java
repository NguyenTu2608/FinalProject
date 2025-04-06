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
    public Admin createAdmin(@RequestBody Admin admin) {
        return userService.saveAdmin(admin);
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
