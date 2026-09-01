package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.dto.ChangePasswordDTO;
import com.gitesh.expensetracker.dto.ProfileDTO;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(User user) {
        validateUser(user);

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already registered.");
        }

        user.setFullName(user.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Transactional
    public User loginUser(String email, String password) {
        if (email == null || password == null) {
            throw new RuntimeException("Email and password are required");
        }

        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password"));

        /*
         * Backward compatibility:
         * old users in the original project may still have plaintext passwords.
         * If a legacy password matches, upgrade it to BCrypt immediately.
         */
        boolean valid;
        if (isBcrypt(user.getPassword())) {
            valid = passwordEncoder.matches(password, user.getPassword());
        } else {
            valid = user.getPassword().equals(password);
            if (valid) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
        }

        if (!valid) {
            throw new RuntimeException("Invalid Email or Password");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public ProfileDTO getProfile(Long userId) {
        User user = getUser(userId);
        return new ProfileDTO(
                user.getUserId(),
                user.getFullName(),
                user.getEmail()
        );
    }

    @Transactional
    public ProfileDTO updateProfile(Long userId, ProfileDTO dto) {
        User user = getUser(userId);

        if (dto == null ||
                dto.getFullName() == null ||
                dto.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name is required");
        }

        String email = dto.getEmail() == null
                ? ""
                : dto.getEmail().trim().toLowerCase();

        if (email.isEmpty() || !email.contains("@")) {
            throw new RuntimeException("Valid email is required");
        }

        userRepository.findByEmailIgnoreCase(email).ifPresent(existing -> {
            if (!existing.getUserId().equals(userId)) {
                throw new RuntimeException("Email already registered");
            }
        });

        user.setFullName(dto.getFullName().trim());
        user.setEmail(email);

        User saved = userRepository.save(user);

        return new ProfileDTO(
                saved.getUserId(),
                saved.getFullName(),
                saved.getEmail()
        );
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordDTO dto) {
        if (dto == null ||
                dto.getCurrentPassword() == null ||
                dto.getNewPassword() == null) {
            throw new RuntimeException("Current and new passwords are required");
        }

        if (dto.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must contain at least 6 characters");
        }

        User user = getUser(userId);

        boolean currentValid;
        if (isBcrypt(user.getPassword())) {
            currentValid = passwordEncoder.matches(
                    dto.getCurrentPassword(), user.getPassword());
        } else {
            currentValid = user.getPassword()
                    .equals(dto.getCurrentPassword());
        }

        if (!currentValid) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(dto.getNewPassword())
        );

        userRepository.save(user);
    }

    public User getUser(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));
    }

    private void validateUser(User user) {
        if (user == null) throw new RuntimeException("User data is required");

        if (user.getFullName() == null ||
                user.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name is required");
        }

        if (user.getEmail() == null ||
                !user.getEmail().trim().contains("@")) {
            throw new RuntimeException("Valid email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters");
        }
    }

    private boolean isBcrypt(String password) {
        return password != null &&
                (password.startsWith("$2a$") ||
                 password.startsWith("$2b$") ||
                 password.startsWith("$2y$"));
    }
}
