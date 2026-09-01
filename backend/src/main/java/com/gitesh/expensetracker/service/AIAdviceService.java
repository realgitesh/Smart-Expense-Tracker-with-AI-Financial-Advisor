package com.gitesh.expensetracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gitesh.expensetracker.entity.AIAdvice;
import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.AIAdviceRepository;
import com.gitesh.expensetracker.repository.ExpenseRepository;
import com.gitesh.expensetracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIAdviceService {

    private final AIAdviceRepository aiAdviceRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;
    private final BudgetService budgetService;
    private final WebClient webClient;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    public AIAdviceService(
            AIAdviceRepository aiAdviceRepository,
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            UserService userService,
            BudgetService budgetService,
            WebClient webClient) {
        this.aiAdviceRepository = aiAdviceRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.budgetService = budgetService;
        this.webClient = webClient;
    }

    public List<AIAdvice> getAdviceHistory(Long userId) {
        User user = userService.getUser(userId);
        return aiAdviceRepository.findByUser(user);
    }

    public String testGeminiConnection() {
        if (apiKey == null || apiKey.isBlank()) {
            return "Gemini is not configured. Set GEMINI_API_KEY.";
        }

        String body = """
                {
                  "contents":[
                    {
                      "parts":[
                        {"text":"Say Hello from Gemini."}
                      ]
                    }
                  ]
                }
                """;

        return webClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("X-goog-api-key", apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String generateFinancialAdvice(Long userId) {
        User user = userService.getUser(userId);

        List<Income> incomes = incomeRepository.findByUser(user);
        List<Expense> expenses = expenseRepository.findByUser(user);

        double totalIncome = incomes.stream()
                .mapToDouble(i -> i.getAmount() == null ? 0 : i.getAmount())
                .sum();

        double totalExpense = expenses.stream()
                .mapToDouble(e -> e.getAmount() == null ? 0 : e.getAmount())
                .sum();

        double balance = totalIncome - totalExpense;

        String categorySummary =
                expenseRepository.getExpenseSummaryByCategory(userId)
                        .stream()
                        .map(row -> row[0] + "=" + row[1])
                        .collect(Collectors.joining(", "));

        double currentBudget =
                budgetService.getCurrentMonthBudget(userId);

        double currentSpent =
                budgetService.getCurrentMonthSpent(userId);

        String prompt = """
                You are an AI financial coach inside a personal expense tracker.

                User:
                %s

                Total income: %.2f
                Total expenses: %.2f
                Current balance: %.2f
                Current month budget: %.2f
                Current month spending: %.2f

                Expense categories:
                %s

                Give practical recommendations based only on this data.
                Include:
                1. spending assessment
                2. biggest spending risk
                3. budget action
                4. saving action
                5. next-month recommendation

                Keep it concise and easy to understand.
                """.formatted(
                user.getFullName(),
                totalIncome,
                totalExpense,
                balance,
                currentBudget,
                currentSpent,
                categorySummary
        );

        if (apiKey == null || apiKey.isBlank()) {
            return saveAndReturn(user, fallbackAdvice(
                    totalIncome, totalExpense, balance,
                    currentBudget, currentSpent, categorySummary));
        }

        String escapedPrompt = prompt
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");

        String body = """
                {
                  "contents":[
                    {
                      "parts":[
                        {"text":"%s"}
                      ]
                    }
                  ]
                }
                """.formatted(escapedPrompt);

        try {
            String response = webClient.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-goog-api-key", apiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            String advice = root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText("");

            if (advice.isBlank()) {
                advice = fallbackAdvice(
                        totalIncome, totalExpense, balance,
                        currentBudget, currentSpent, categorySummary);
            }

            return saveAndReturn(user, advice);

        } catch (Exception e) {
            return saveAndReturn(user, fallbackAdvice(
                    totalIncome, totalExpense, balance,
                    currentBudget, currentSpent, categorySummary));
        }
    }

    private String saveAndReturn(User user, String advice) {
        AIAdvice entity = new AIAdvice();
        entity.setAdvice(advice);
        entity.setUser(user);
        aiAdviceRepository.save(entity);
        return advice;
    }

    private String fallbackAdvice(
            double income,
            double expense,
            double balance,
            double budget,
            double spent,
            String categories) {

        double ratio = income <= 0 ? 100 : (expense / income) * 100;

        StringBuilder result = new StringBuilder();

        result.append("1. Your expenses are ")
                .append(String.format("%.1f", ratio))
                .append("% of your recorded income. ");

        if (balance < 0) {
            result.append("Your spending is currently higher than income.\n");
        } else {
            result.append("Your current cash flow is positive.\n");
        }

        result.append("2. Review your largest categories: ")
                .append(categories.isBlank() ? "no category data yet" : categories)
                .append(".\n");

        result.append("3. Current month budget usage is ")
                .append(String.format("%.1f",
                        budget <= 0 ? 0 : spent / budget * 100))
                .append("%.\n");

        result.append("4. Set a specific limit for your highest-spending category next month.\n");

        result.append("5. Keep a portion of every positive monthly balance as savings before discretionary spending.");

        return result.toString();
    }
}
