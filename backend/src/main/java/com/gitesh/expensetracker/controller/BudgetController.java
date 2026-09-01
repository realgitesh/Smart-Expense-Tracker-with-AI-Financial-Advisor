package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.dto.BudgetProgressDTO;
import com.gitesh.expensetracker.entity.Budget;
import com.gitesh.expensetracker.service.BudgetService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin("*")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping("/{userId}")
    public Budget addBudget(
            @PathVariable Long userId,
            @RequestBody Budget budget) {
        return budgetService.addBudget(userId, budget);
    }

    @GetMapping("/user/{userId}")
    public List<Budget> getBudgetsByUser(@PathVariable Long userId) {
        return budgetService.getBudgetsByUser(userId);
    }

    @GetMapping("/current/{userId}")
    public List<Budget> getCurrentBudgets(
            @PathVariable Long userId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return budgetService.getCurrentBudgets(userId, month, year);
    }

    @GetMapping("/progress/{userId}")
    public List<BudgetProgressDTO> getBudgetProgress(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate now = LocalDate.now();
        return budgetService.getBudgetProgress(
                userId,
                month == null ? now.getMonthValue() : month,
                year == null ? now.getYear() : year
        );
    }

    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budget) {
        return budgetService.updateBudget(id, budget);
    }

    @DeleteMapping("/{id}")
    public String deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return "Budget Deleted Successfully";
    }
}
