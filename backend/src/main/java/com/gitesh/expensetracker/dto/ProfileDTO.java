package com.gitesh.expensetracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private Long userId;
    private String fullName;
    private String email;
}
