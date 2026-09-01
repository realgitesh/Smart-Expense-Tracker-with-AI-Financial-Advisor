package com.gitesh.expensetracker.repository;

import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i")
    Double getTotalIncome();

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user = :user")
    Double getTotalIncomeByUser(@Param("user") User user);

    @Query("SELECT COUNT(i) FROM Income i WHERE i.user = :user")
    long countByUser(@Param("user") User user);

    List<Income> findByUser(User user);

    List<Income> findByUserOrderByIncomeDateDesc(User user);

    List<Income> findByUserAndIncomeDateBetween(
            User user, LocalDate startDate, LocalDate endDate);

    List<Income> findByUserAndIncomeDateBetweenOrderByIncomeDateDesc(
            User user, LocalDate startDate, LocalDate endDate);

    List<Income> findTop5ByUserOrderByIncomeDateDesc(User user);

    @Query("""
        SELECT COALESCE(SUM(i.amount), 0)
        FROM Income i
        WHERE i.user = :user
        AND MONTH(i.incomeDate) = :month
        """)
    Double getMonthlyIncome(
            @Param("user") User user,
            @Param("month") int month);

    @Query("""
        SELECT COALESCE(SUM(i.amount), 0)
        FROM Income i
        WHERE i.user = :user
        AND MONTH(i.incomeDate) = :month
        AND YEAR(i.incomeDate) = :year
        """)
    Double getMonthlyIncomeByYear(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);

    @Query("""
        SELECT YEAR(i.incomeDate), COALESCE(SUM(i.amount), 0)
        FROM Income i
        WHERE i.user = :user
        GROUP BY YEAR(i.incomeDate)
        ORDER BY YEAR(i.incomeDate)
        """)
    List<Object[]> getYearlyIncome(@Param("user") User user);

    @Query("""
        SELECT COALESCE(SUM(i.amount), 0)
        FROM Income i
        WHERE i.user = :user
        AND i.incomeDate BETWEEN :startDate AND :endDate
        """)
    Double getTotalIncomeBetweenDates(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
