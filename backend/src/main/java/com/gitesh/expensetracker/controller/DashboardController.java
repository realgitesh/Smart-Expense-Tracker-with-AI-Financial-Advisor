package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.dto.BudgetProgressDTO;
import com.gitesh.expensetracker.dto.DashboardDTO;
import com.gitesh.expensetracker.dto.RecentTransactionDTO;
import com.gitesh.expensetracker.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}")
    public DashboardDTO getDashboard(@PathVariable Long userId) {
        return dashboardService.getDashboard(userId);
    }

    @GetMapping("/recent/{userId}")
    public List<RecentTransactionDTO> getRecentTransactions(
            @PathVariable Long userId) {
        return dashboardService.getRecentTransactions(userId);
    }

    @GetMapping("/monthly/{userId}")
    public Map<String, Double> getMonthlyAnalytics(
            @PathVariable Long userId) {
        return dashboardService.getMonthlyAnalytics(userId);
    }

    @GetMapping("/yearly/{userId}")
    public Map<Integer, Double> getYearlyAnalytics(
            @PathVariable Long userId) {
        return dashboardService.getYearlyAnalytics(userId);
    }

    @GetMapping("/budget-progress/{userId}")
    public List<BudgetProgressDTO> getCurrentBudgetProgress(
            @PathVariable Long userId) {
        return dashboardService.getCurrentBudgetProgress(userId);
    }
}
