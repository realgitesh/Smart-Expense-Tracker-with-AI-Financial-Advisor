package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.dto.ExpenseSummaryDTO;
import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final BudgetAlertService budgetAlertService;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            UserService userService,
            BudgetAlertService budgetAlertService) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.budgetAlertService = budgetAlertService;
    }

    @Transactional
    public Expense addExpense(Long userId, Expense expense) {
        User user = userService.getUser(userId);
        validateExpense(expense);

        expense.setTitle(normalize(expense.getTitle()));
        expense.setCategory(normalize(expense.getCategory()));
        expense.setDescription(
                expense.getDescription() == null
                        ? ""
                        : expense.getDescription().trim());

        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);
        budgetAlertService.checkAndNotify(user, saved.getExpenseDate());
        return saved;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserOrderByExpenseDateDesc(
                userService.getUser(userId));
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense Not Found"));
    }

    public List<Expense> getExpensesByDate(
            Long userId, String startDate, String endDate) {

        User user = userService.getUser(userId);
        LocalDate[] dates = parseRange(startDate, endDate);

        return expenseRepository
                .findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
                        user, dates[0], dates[1]);
    }

    @Transactional
    public Expense updateExpense(Long id, Long userId, Expense incoming) {
        Expense expense = getExpenseById(id);
        User user = userService.getUser(userId);

        if (!expense.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You cannot modify another user's expense");
        }

        validateExpense(incoming);

        expense.setTitle(normalize(incoming.getTitle()));
        expense.setAmount(incoming.getAmount());
        expense.setCategory(normalize(incoming.getCategory()));
        expense.setDescription(
                incoming.getDescription() == null
                        ? ""
                        : incoming.getDescription().trim());
        expense.setExpenseDate(incoming.getExpenseDate());

        Expense saved = expenseRepository.save(expense);
        budgetAlertService.checkAndNotify(user, saved.getExpenseDate());
        return saved;
    }

    @Transactional
    public void deleteExpense(Long id, Long userId) {
        Expense expense = getExpenseById(id);
        User user = userService.getUser(userId);

        if (!expense.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You cannot delete another user's expense");
        }

        expenseRepository.delete(expense);
    }

    public Double getTotalExpenseByUser(Long userId) {
        return safe(expenseRepository.getTotalExpenseByUser(
                userService.getUser(userId)));
    }

    public List<Expense> getRecentExpenses(Long userId) {
        return expenseRepository.findTop5ByUserOrderByExpenseDateDesc(
                userService.getUser(userId));
    }

    public Double getMonthlyExpense(Long userId, Integer month) {
        if (month == null || month < 1 || month > 12) {
            throw new RuntimeException("Invalid month");
        }

        return safe(expenseRepository.getMonthlyExpense(
                userService.getUser(userId), month));
    }

    public List<Object[]> getYearlyExpense(Long userId) {
        return expenseRepository.getYearlyExpense(userService.getUser(userId));
    }

    public List<ExpenseSummaryDTO> getExpenseSummary(Long userId) {
        userService.getUser(userId);

        List<Object[]> result =
                expenseRepository.getExpenseSummaryByCategory(userId);

        List<ExpenseSummaryDTO> summary = new ArrayList<>();

        for (Object[] row : result) {
            summary.add(new ExpenseSummaryDTO(
                    row[0] == null ? "Other" : row[0].toString(),
                    row[1] == null ? 0.0 :
                            ((Number) row[1]).doubleValue()));
        }

        return summary;
    }

    private LocalDate[] parseRange(String startDate, String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            if (start.isAfter(end)) {
                throw new RuntimeException(
                        "Start date cannot be after end date");
            }

            return new LocalDate[]{start, end};
        } catch (DateTimeParseException e) {
            throw new RuntimeException(
                    "Invalid date format. Use yyyy-MM-dd");
        }
    }

    private void validateExpense(Expense expense) {
        if (expense == null) throw new RuntimeException("Expense data is required");

        if (expense.getTitle() == null ||
                expense.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }

        if (expense.getAmount() == null ||
                !Double.isFinite(expense.getAmount()) ||
                expense.getAmount() <= 0) {
            throw new RuntimeException(
                    "Expense amount must be greater than zero");
        }

        if (expense.getCategory() == null ||
                expense.getCategory().trim().isEmpty()) {
            throw new RuntimeException("Category is required");
        }

        if (expense.getExpenseDate() == null) {
            throw new RuntimeException("Expense date is required");
        }
    }

    private String normalize(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }
}
