package com.gitesh.expensetracker.repository;

import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    Double getTotalExpense();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user")
    Double getTotalExpenseByUser(@Param("user") User user);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user")
    long countByUser(@Param("user") User user);

    List<Expense> findByUser(User user);

    List<Expense> findByUserOrderByExpenseDateDesc(User user);

    List<Expense> findByUserAndExpenseDateBetween(
            User user, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
            User user, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserAndCategoryIgnoreCaseOrderByExpenseDateDesc(
            User user, String category);

    @Query("""
        SELECT e.category, COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user.userId = :userId
        GROUP BY e.category
        ORDER BY SUM(e.amount) DESC
        """)
    List<Object[]> getExpenseSummaryByCategory(@Param("userId") Long userId);

    List<Expense> findTop5ByUserOrderByExpenseDateDesc(User user);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        AND MONTH(e.expenseDate) = :month
        """)
    Double getMonthlyExpense(@Param("user") User user, @Param("month") int month);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        AND MONTH(e.expenseDate) = :month
        AND YEAR(e.expenseDate) = :year
        """)
    Double getMonthlyExpenseByYear(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);

    @Query("""
        SELECT YEAR(e.expenseDate), COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        GROUP BY YEAR(e.expenseDate)
        ORDER BY YEAR(e.expenseDate)
        """)
    List<Object[]> getYearlyExpense(@Param("user") User user);

    @Query("""
        SELECT e.category, COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        AND MONTH(e.expenseDate) = :month
        AND YEAR(e.expenseDate) = :year
        GROUP BY e.category
        ORDER BY SUM(e.amount) DESC
        """)
    List<Object[]> getMonthlyExpenseSummaryByCategory(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        AND e.expenseDate BETWEEN :startDate AND :endDate
        """)
    Double getTotalExpenseBetweenDates(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
        AND LOWER(e.category) = LOWER(:category)
        AND e.expenseDate BETWEEN :startDate AND :endDate
        """)
    Double getCategoryExpenseBetweenDates(
            @Param("user") User user,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
