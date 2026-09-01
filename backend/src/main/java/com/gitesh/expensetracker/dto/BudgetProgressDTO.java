package com.gitesh.expensetracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BudgetProgressDTO {
    private Long budgetId;
    private String category;
    private Double budgetAmount;
    private Double spentAmount;
    private Double remainingAmount;
    private Double percentageUsed;
    private String status;
    private Integer month;
    private Integer year;
}
