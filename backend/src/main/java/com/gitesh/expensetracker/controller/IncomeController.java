package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin("*")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping("/{userId}")
    public Income addIncome(
            @PathVariable Long userId,
            @RequestBody Income income) {
        return incomeService.addIncome(userId, income);
    }

    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }

    @GetMapping("/{id}")
    public Income getIncomeById(@PathVariable Long id) {
        return incomeService.getIncomeById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Income> getIncomeByUser(@PathVariable Long userId) {
        return incomeService.getIncomeByUser(userId);
    }

    @GetMapping("/total/{userId}")
    public Double getTotalIncome(@PathVariable Long userId) {
        return incomeService.getTotalIncomeByUser(userId);
    }

    @GetMapping("/recent/{userId}")
    public List<Income> getRecentIncome(@PathVariable Long userId) {
        return incomeService.getRecentIncome(userId);
    }

    @GetMapping("/report/{userId}")
    public List<Income> getIncomeByDate(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return incomeService.getIncomeByDate(
                userId, startDate, endDate);
    }

    @GetMapping("/monthly/{userId}")
    public Double getMonthlyIncome(
            @PathVariable Long userId,
            @RequestParam Integer month) {
        return incomeService.getMonthlyIncome(userId, month);
    }

    @GetMapping("/yearly/{userId}")
    public List<Object[]> getYearlyIncome(@PathVariable Long userId) {
        return incomeService.getYearlyIncome(userId);
    }

    @PutMapping("/{userId}/{id}")
    public Income updateIncome(
            @PathVariable Long userId,
            @PathVariable Long id,
            @RequestBody Income income) {
        return incomeService.updateIncome(id, userId, income);
    }

    @DeleteMapping("/{userId}/{id}")
    public String deleteIncome(
            @PathVariable Long userId,
            @PathVariable Long id) {
        incomeService.deleteIncome(id, userId);
        return "Income Deleted Successfully";
    }

    @PutMapping("/legacy/{id}")
    public Income updateIncomeLegacy(
            @PathVariable Long id,
            @RequestBody Income income) {
        Income existing = incomeService.getIncomeById(id);
        return incomeService.updateIncome(
                id, existing.getUser().getUserId(), income);
    }

    @DeleteMapping("/legacy/{id}")
    public String deleteIncomeLegacy(@PathVariable Long id) {
        Income existing = incomeService.getIncomeById(id);
        incomeService.deleteIncome(
                id, existing.getUser().getUserId());
        return "Income Deleted Successfully";
    }
}
