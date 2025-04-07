package com.example.chinesechess.service;

import com.example.chinesechess.model.Admin;
import com.example.chinesechess.model.User;
import com.example.chinesechess.repository.AdminRepository;
import com.example.chinesechess.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User createUser(User user) {
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        String password = user.getPassword();
        if (!password.startsWith("$2a$") && !password.startsWith("$2b$")) {
            password = passwordEncoder.encode(password);
        }
        user.setPassword(password);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public void deleteUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        userRepository.delete(user);
    }


    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(String id) {
        return adminRepository.findById(id);
    }

    public Admin getAdminByUsername(String username) {
        return adminRepository.findByUsername(username).orElse(null);
    }

    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email).orElse(null);
    }

    public void deleteAdmin(String id) {
        adminRepository.deleteById(id);
    }
    public void deleteAdminByUsername(String username) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        adminRepository.delete(admin);
    }

    public Admin saveAdmin(Admin admin) {
        String password = admin.getPassword();
        if (!password.startsWith("$2a$") && !password.startsWith("$2b$")) {
            password = passwordEncoder.encode(password);
        }
        admin.setPassword(password);
        return adminRepository.save(admin);
    }
}
