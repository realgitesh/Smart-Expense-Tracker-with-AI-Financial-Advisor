package com.gitesh.expensetracker.repository;

import com.gitesh.expensetracker.entity.Budget;
import com.gitesh.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    List<Budget> findByUserOrderByYearDescMonthDescCategoryAsc(User user);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(
            User user, String category, Integer month, Integer year);

    List<Budget> findByUserAndMonthAndYear(
            User user, Integer month, Integer year);
}
