package com.gitesh.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentTransactionDTO {

    private String type;      // Income or Expense
    private String title;     // Source or Expense Title
    private Double amount;
    private String category;
    private String date;
}