package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.entity.AIAdvice;
import com.gitesh.expensetracker.service.AIAdviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIAdviceController {

    @Autowired
    private AIAdviceService aiAdviceService;

    // Test Gemini API
    @GetMapping("/test")
    public String testGemini() {
        return aiAdviceService.testGeminiConnection();
    }

    // Generate Financial Advice
    @GetMapping("/advice/{userId}")
    public String generateAdvice(@PathVariable Long userId) {
        return aiAdviceService.generateFinancialAdvice(userId);
    }

    // Get Advice History
    @GetMapping("/history/{userId}")
    public List<AIAdvice> getAdviceHistory(@PathVariable Long userId) {
        return aiAdviceService.getAdviceHistory(userId);
    }
}