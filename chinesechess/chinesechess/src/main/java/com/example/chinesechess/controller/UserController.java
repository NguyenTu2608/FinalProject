package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.PasswordChangeRequest;
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
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        // Kiểm tra xem username có trống không
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username không được để trống!");
        }
        // Kiểm tra xem email có trống không
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống!");
        }

        // Kiểm tra xem password có trống không
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password không được để trống!");
        }

        String email = user.getEmail().trim();
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return ResponseEntity.badRequest().body("Email không đúng định dạng!");
        }

        // Kiểm tra xem username đã tồn tại chưa
        Optional<User> existingUserByUsername = Optional.ofNullable(userService.getUserByUsername(user.getUsername()));
        if (existingUserByUsername.isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại!");
        }

        // Kiểm tra xem email đã tồn tại chưa
        Optional<User> existingUserByEmail = Optional.ofNullable(userService.getUserByEmail(user.getEmail()));
        if (existingUserByEmail.isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        // Nếu không có trùng lặp và các trường hợp trên đã được kiểm tra, lưu người dùng mới vào cơ sở dữ liệu
        userService.saveUser(user);
        return ResponseEntity.ok("Người dùng đã được thêm thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (userService.getUserById(id).isPresent()) {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/username/{username}")
    public ResponseEntity<Void> deleteUserByUsername(@PathVariable String username) {
        try {
            userService.deleteUserByUsername(username);  // Gọi dịch vụ xóa admin theo username
            return ResponseEntity.noContent().build();   // Trả về 204 No Content nếu xóa thành công
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();    // Trả về 404 Not Found nếu admin không tồn tại
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token không hợp lệ");
        }

        token = token.substring(7); // Bỏ "Bearer "

        if (!JwtUtil.verifyToken(token)) {
            return ResponseEntity.status(401).body("Token không hợp lệ hoặc đã hết hạn");
        }
        String email = JwtUtil.extractEmail(token); // Lấy email từ token
        User user = userService.getUserByEmail(email);

        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        // Kiểm tra người dùng có tồn tại không dựa trên username
        User existingUser = userService.getUserByUsername(username);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }

        if (updatedUser.getEmail() == null || updatedUser.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống!");
        }
        if (updatedUser.getPassword() == null || updatedUser.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password không được để trống!");
        }
        if (updatedUser.getChessElo() == null) {
            return ResponseEntity.badRequest().body("ChessElo không được để trống!");
        }
        if (updatedUser.getChessDownElo() == null) {
            return ResponseEntity.badRequest().body("ChessDownElo không được để trống!");
        }

        // Kiểm tra xem username mới có trùng với người dùng khác không
        if (!existingUser.getUsername().equals(updatedUser.getUsername())) {
            User userWithSameUsername = userService.getUserByUsername(updatedUser.getUsername());
            if (userWithSameUsername != null) {
                return ResponseEntity.badRequest().body("Username đã tồn tại!");
            }
        }
        // Kiểm tra xem email mới có trùng với người dùng khác không
        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            User userWithSameEmail = userService.getUserByEmail(updatedUser.getEmail());
            if (userWithSameEmail != null) {
                return ResponseEntity.badRequest().body("Email đã tồn tại!");
            }
        }

        // Cập nhật thông tin người dùng
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        existingUser.setChessElo(updatedUser.getChessElo());
        existingUser.setChessDownElo(updatedUser.getChessDownElo());

        // Lưu lại người dùng đã được cập nhật
        userService.saveUser(existingUser);

        return ResponseEntity.ok("Người dùng đã được cập nhật thành công!");
    }





    @PostMapping("/changepassword")
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
        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(403).body("Mật khẩu cũ không đúng");
        }

        // Kiểm tra xác nhận mật khẩu mới
        if (!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Xác nhận mật khẩu mới không khớp");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
}
