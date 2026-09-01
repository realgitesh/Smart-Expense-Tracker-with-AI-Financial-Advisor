package com.gitesh.expensetracker.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Integer totalIncomeTransactions;
    private Integer totalExpenseTransactions;

    // Budget analytics
    private Double currentMonthBudget;
    private Double currentMonthExpense;
    private Double currentMonthBudgetRemaining;
    private Double currentMonthBudgetUsagePercentage;
}
