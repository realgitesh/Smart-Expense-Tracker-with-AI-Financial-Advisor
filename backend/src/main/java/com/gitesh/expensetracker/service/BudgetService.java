package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.dto.BudgetProgressDTO;
import com.gitesh.expensetracker.entity.Budget;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.BudgetRepository;
import com.gitesh.expensetracker.repository.ExpenseRepository;
import com.gitesh.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public Budget addBudget(Long userId, Budget budget) {
        User user = getUser(userId);
        validateBudget(budget);

        String category = normalizeCategory(budget.getCategory());

        if (budgetRepository.findByUserAndCategoryAndMonthAndYear(
                user, category, budget.getMonth(), budget.getYear()).isPresent()) {
            throw new RuntimeException(
                    "Budget already exists for this category, month and year");
        }

        budget.setCategory(category);
        budget.setUser(user);
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserOrderByYearDescMonthDescCategoryAsc(getUser(userId));
    }

    public List<Budget> getCurrentBudgets(Long userId, Integer month, Integer year) {
        validatePeriod(month, year);
        return budgetRepository.findByUserAndMonthAndYear(
                getUser(userId), month, year);
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget Not Found"));
    }

    public Budget updateBudget(Long id, Budget newBudget) {
        Budget budget = getBudgetById(id);
        validateBudget(newBudget);

        String category = normalizeCategory(newBudget.getCategory());

        budgetRepository.findByUserAndCategoryAndMonthAndYear(
                budget.getUser(), category, newBudget.getMonth(), newBudget.getYear()
        ).ifPresent(existing -> {
            if (!existing.getBudgetId().equals(id)) {
                throw new RuntimeException(
                        "Budget already exists for this category, month and year");
            }
        });

        budget.setCategory(category);
        budget.setAmount(newBudget.getAmount());
        budget.setMonth(newBudget.getMonth());
        budget.setYear(newBudget.getYear());

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        budgetRepository.delete(getBudgetById(id));
    }

    public List<BudgetProgressDTO> getBudgetProgress(
            Long userId, Integer month, Integer year) {

        validatePeriod(month, year);

        User user = getUser(userId);
        List<Budget> budgets =
                budgetRepository.findByUserAndMonthAndYear(user, month, year);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<BudgetProgressDTO> result = new ArrayList<>();

        for (Budget budget : budgets) {
            double budgetAmount = safe(budget.getAmount());

            double spent = safe(expenseRepository.getCategoryExpenseBetweenDates(
                    user, budget.getCategory(), start, end));

            double remaining = budgetAmount - spent;
            double percentage = budgetAmount == 0
                    ? 0
                    : (spent / budgetAmount) * 100.0;

            String status;
            if (spent > budgetAmount) {
                status = "OVER_BUDGET";
            } else if (percentage >= 80) {
                status = "WARNING";
            } else {
                status = "ON_TRACK";
            }

            result.add(new BudgetProgressDTO(
                    budget.getBudgetId(),
                    budget.getCategory(),
                    budgetAmount,
                    spent,
                    remaining,
                    Math.round(percentage * 100.0) / 100.0,
                    status,
                    month,
                    year
            ));
        }

        return result;
    }

    public double getCurrentMonthBudget(Long userId) {
        LocalDate now = LocalDate.now();
        return budgetRepository.findByUserAndMonthAndYear(
                getUser(userId), now.getMonthValue(), now.getYear())
                .stream()
                .mapToDouble(b -> safe(b.getAmount()))
                .sum();
    }

    public double getCurrentMonthSpent(Long userId) {
        LocalDate now = LocalDate.now();
        User user = getUser(userId);
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());

        return safe(expenseRepository.getTotalExpenseBetweenDates(user, start, end));
    }

    private User getUser(Long userId) {
        if (userId == null) throw new RuntimeException("User ID is required");
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    private void validateBudget(Budget budget) {
        if (budget == null) throw new RuntimeException("Budget data is required");

        if (budget.getCategory() == null ||
                budget.getCategory().trim().isEmpty()) {
            throw new RuntimeException("Category is required");
        }

        if (budget.getAmount() == null ||
                !Double.isFinite(budget.getAmount()) ||
                budget.getAmount() <= 0) {
            throw new RuntimeException("Budget amount must be greater than zero");
        }

        validatePeriod(budget.getMonth(), budget.getYear());
    }

    private void validatePeriod(Integer month, Integer year) {
        if (month == null || month < 1 || month > 12) {
            throw new RuntimeException("Invalid month");
        }
        if (year == null || year < 2000 || year > 2100) {
            throw new RuntimeException("Invalid year");
        }
    }

    private String normalizeCategory(String category) {
        return category.trim().replaceAll("\\s+", " ");
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }
}
