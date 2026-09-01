package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.dto.ChangePasswordDTO;
import com.gitesh.expensetracker.dto.ProfileDTO;
import com.gitesh.expensetracker.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ProfileDTO getProfile(@PathVariable Long userId) {
        return userService.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public ProfileDTO updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileDTO dto) {
        return userService.updateProfile(userId, dto);
    }

    @PutMapping("/{userId}/password")
    public String changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(userId, dto);
        return "Password changed successfully";
    }
}
