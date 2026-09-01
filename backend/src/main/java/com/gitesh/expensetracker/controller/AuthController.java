package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.dto.LoginDTO;
import com.gitesh.expensetracker.dto.UserDTO;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        User saved = userService.registerUser(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Registration Successful");
        response.put("userId", saved.getUserId());
        response.put("fullName", saved.getFullName());
        response.put("email", saved.getEmail());
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginDTO dto) {
        User user = userService.loginUser(
                dto.getEmail(), dto.getPassword());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Login Successful");
        response.put("userId", user.getUserId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        return response;
    }
}
