package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.dto.ExpenseSummaryDTO;
import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin("*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/{userId}")
    public Expense addExpense(
            @PathVariable Long userId,
            @RequestBody Expense expense) {
        return expenseService.addExpense(userId, expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    @GetMapping("/report/{userId}")
    public List<Expense> getExpensesByDate(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return expenseService.getExpensesByDate(
                userId, startDate, endDate);
    }

    @GetMapping("/summary/{userId}")
    public List<ExpenseSummaryDTO> getExpenseSummary(
            @PathVariable Long userId) {
        return expenseService.getExpenseSummary(userId);
    }

    @GetMapping("/total/{userId}")
    public Double getTotalExpense(@PathVariable Long userId) {
        return expenseService.getTotalExpenseByUser(userId);
    }

    @GetMapping("/recent/{userId}")
    public List<Expense> getRecentExpenses(@PathVariable Long userId) {
        return expenseService.getRecentExpenses(userId);
    }

    @GetMapping("/monthly/{userId}")
    public Double getMonthlyExpense(
            @PathVariable Long userId,
            @RequestParam Integer month) {
        return expenseService.getMonthlyExpense(userId, month);
    }

    @GetMapping("/yearly/{userId}")
    public List<Object[]> getYearlyExpense(@PathVariable Long userId) {
        return expenseService.getYearlyExpense(userId);
    }

    @PutMapping("/{userId}/{id}")
    public Expense updateExpense(
            @PathVariable Long userId,
            @PathVariable Long id,
            @RequestBody Expense expense) {
        return expenseService.updateExpense(id, userId, expense);
    }

    @DeleteMapping("/{userId}/{id}")
    public String deleteExpense(
            @PathVariable Long userId,
            @PathVariable Long id) {
        expenseService.deleteExpense(id, userId);
        return "Expense Deleted Successfully";
    }
}
