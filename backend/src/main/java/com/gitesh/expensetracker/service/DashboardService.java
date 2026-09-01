package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.dto.BudgetProgressDTO;
import com.gitesh.expensetracker.dto.DashboardDTO;
import com.gitesh.expensetracker.dto.RecentTransactionDTO;
import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.ExpenseRepository;
import com.gitesh.expensetracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserService userService;
    private final BudgetService budgetService;

    public DashboardService(
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            UserService userService,
            BudgetService budgetService) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userService = userService;
        this.budgetService = budgetService;
    }

    public DashboardDTO getDashboard(Long userId) {
        User user = userService.getUser(userId);

        double totalIncome =
                safe(incomeRepository.getTotalIncomeByUser(user));

        double totalExpense =
                safe(expenseRepository.getTotalExpenseByUser(user));

        double currentBudget =
                budgetService.getCurrentMonthBudget(userId);

        double currentExpense =
                budgetService.getCurrentMonthSpent(userId);

        double remaining = currentBudget - currentExpense;

        double percentage = currentBudget == 0
                ? 0
                : currentExpense / currentBudget * 100;

        return new DashboardDTO(
                totalIncome,
                totalExpense,
                totalIncome - totalExpense,
                (int) incomeRepository.countByUser(user),
                (int) expenseRepository.countByUser(user),
                currentBudget,
                currentExpense,
                remaining,
                Math.round(percentage * 100.0) / 100.0
        );
    }

    public List<RecentTransactionDTO> getRecentTransactions(Long userId) {
        User user = userService.getUser(userId);

        List<RecentTransactionDTO> transactions = new ArrayList<>();

        for (Expense expense :
                expenseRepository.findTop5ByUserOrderByExpenseDateDesc(user)) {

            transactions.add(new RecentTransactionDTO(
                    "Expense",
                    expense.getTitle(),
                    expense.getAmount(),
                    expense.getCategory(),
                    expense.getExpenseDate().toString()
            ));
        }

        for (Income income :
                incomeRepository.findTop5ByUserOrderByIncomeDateDesc(user)) {

            transactions.add(new RecentTransactionDTO(
                    "Income",
                    income.getSource(),
                    income.getAmount(),
                    "Income",
                    income.getIncomeDate().toString()
            ));
        }

        transactions.sort(
                Comparator.comparing(
                        RecentTransactionDTO::getDate
                ).reversed());

        return transactions.size() > 10
                ? new ArrayList<>(transactions.subList(0, 10))
                : transactions;
    }

    public Map<String, Double> getMonthlyAnalytics(Long userId) {
        User user = userService.getUser(userId);
        Map<String, Double> data = new LinkedHashMap<>();

        for (Month month : Month.values()) {
            data.put(
                    month.name(),
                    safe(expenseRepository.getMonthlyExpenseByYear(
                            user,
                            month.getValue(),
                            LocalDate.now().getYear()))
            );
        }

        return data;
    }

    public Map<Integer, Double> getYearlyAnalytics(Long userId) {
        User user = userService.getUser(userId);
        Map<Integer, Double> data = new LinkedHashMap<>();

        for (Object[] row : expenseRepository.getYearlyExpense(user)) {
            data.put(
                    ((Number) row[0]).intValue(),
                    ((Number) row[1]).doubleValue()
            );
        }

        return data;
    }

    public List<BudgetProgressDTO> getCurrentBudgetProgress(Long userId) {
        LocalDate now = LocalDate.now();
        return budgetService.getBudgetProgress(
                userId,
                now.getMonthValue(),
                now.getYear()
        );
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }
}
