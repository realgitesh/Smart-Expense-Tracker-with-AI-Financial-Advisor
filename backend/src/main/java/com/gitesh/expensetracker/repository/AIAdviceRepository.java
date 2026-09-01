package com.gitesh.expensetracker.repository;

import com.gitesh.expensetracker.entity.AIAdvice;
import com.gitesh.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIAdviceRepository extends JpaRepository<AIAdvice, Long> {

    List<AIAdvice> findByUser(User user);
}