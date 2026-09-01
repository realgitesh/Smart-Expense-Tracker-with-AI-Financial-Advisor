package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.dto.BudgetProgressDTO;
import com.gitesh.expensetracker.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BudgetAlertService {

    private final BudgetService budgetService;
    private final EmailService emailService;

    public BudgetAlertService(
            BudgetService budgetService,
            EmailService emailService) {
        this.budgetService = budgetService;
        this.emailService = emailService;
    }

    public void checkAndNotify(User user, LocalDate date) {
        if (user == null || date == null || !emailService.isEnabled()) {
            return;
        }

        List<BudgetProgressDTO> progress =
                budgetService.getBudgetProgress(
                        user.getUserId(),
                        date.getMonthValue(),
                        date.getYear());

        for (BudgetProgressDTO item : progress) {
            if ("OVER_BUDGET".equals(item.getStatus())) {
                String subject =
                        "Expense Tracker - Budget exceeded: " +
                        item.getCategory();

                String body = """
                        Hello %s,

                        Your %s budget has been exceeded.

                        Budget: ₹%.2f
                        Spent: ₹%.2f
                        Remaining: ₹%.2f

                        Please review your spending in the Expense Tracker.

                        """.formatted(
                                user.getFullName(),
                                item.getCategory(),
                                item.getBudgetAmount(),
                                item.getSpentAmount(),
                                item.getRemainingAmount()
                        );

                emailService.send(user.getEmail(), subject, body);
            }
        }
    }
}
