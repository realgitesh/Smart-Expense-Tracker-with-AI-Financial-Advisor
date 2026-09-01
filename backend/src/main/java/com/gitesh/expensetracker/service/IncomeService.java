package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserService userService;

    public IncomeService(
            IncomeRepository incomeRepository,
            UserService userService) {
        this.incomeRepository = incomeRepository;
        this.userService = userService;
    }

    @Transactional
    public Income addIncome(Long userId, Income income) {
        User user = userService.getUser(userId);
        validateIncome(income);

        income.setSource(normalize(income.getSource()));
        income.setUser(user);

        return incomeRepository.save(income);
    }

    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    public Income getIncomeById(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income Not Found"));
    }

    public List<Income> getIncomeByUser(Long userId) {
        return incomeRepository.findByUserOrderByIncomeDateDesc(
                userService.getUser(userId));
    }

    public Double getTotalIncomeByUser(Long userId) {
        return safe(incomeRepository.getTotalIncomeByUser(
                userService.getUser(userId)));
    }

    public List<Income> getRecentIncome(Long userId) {
        return incomeRepository.findTop5ByUserOrderByIncomeDateDesc(
                userService.getUser(userId));
    }

    public List<Income> getIncomeByDate(
            Long userId, String startDate, String endDate) {
        User user = userService.getUser(userId);

        LocalDate start;
        LocalDate end;

        try {
            start = LocalDate.parse(startDate);
            end = LocalDate.parse(endDate);
        } catch (DateTimeParseException e) {
            throw new RuntimeException(
                    "Invalid date format. Use yyyy-MM-dd");
        }

        if (start.isAfter(end)) {
            throw new RuntimeException(
                    "Start date cannot be after end date");
        }

        return incomeRepository
                .findByUserAndIncomeDateBetweenOrderByIncomeDateDesc(
                        user, start, end);
    }

    public Double getMonthlyIncome(Long userId, Integer month) {
        if (month == null || month < 1 || month > 12) {
            throw new RuntimeException("Invalid month");
        }

        return safe(incomeRepository.getMonthlyIncome(
                userService.getUser(userId), month));
    }

    public List<Object[]> getYearlyIncome(Long userId) {
        return incomeRepository.getYearlyIncome(
                userService.getUser(userId));
    }

    @Transactional
    public Income updateIncome(
            Long id, Long userId, Income newIncome) {

        Income income = getIncomeById(id);
        User user = userService.getUser(userId);

        if (!income.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException(
                    "You cannot modify another user's income");
        }

        validateIncome(newIncome);

        income.setAmount(newIncome.getAmount());
        income.setSource(normalize(newIncome.getSource()));
        income.setIncomeDate(newIncome.getIncomeDate());

        return incomeRepository.save(income);
    }

    @Transactional
    public void deleteIncome(Long id, Long userId) {
        Income income = getIncomeById(id);
        User user = userService.getUser(userId);

        if (!income.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException(
                    "You cannot delete another user's income");
        }

        incomeRepository.delete(income);
    }

    private void validateIncome(Income income) {
        if (income == null) {
            throw new RuntimeException("Income data is required");
        }

        if (income.getAmount() == null ||
                !Double.isFinite(income.getAmount()) ||
                income.getAmount() <= 0) {
            throw new RuntimeException(
                    "Income amount must be greater than zero");
        }

        if (income.getSource() == null ||
                income.getSource().trim().isEmpty()) {
            throw new RuntimeException("Income source is required");
        }

        if (income.getIncomeDate() == null) {
            throw new RuntimeException("Income date is required");
        }
    }

    private String normalize(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }
}
