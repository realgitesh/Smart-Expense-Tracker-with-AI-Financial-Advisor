
package com.gitesh.expensetracker.service;

import com.gitesh.expensetracker.entity.Expense;
import com.gitesh.expensetracker.entity.Income;
import com.gitesh.expensetracker.entity.User;
import com.gitesh.expensetracker.repository.ExpenseRepository;
import com.gitesh.expensetracker.repository.IncomeRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserService userService;

    public ReportService(
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            UserService userService) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userService = userService;
    }

    public byte[] exportExcel(
            Long userId,
            LocalDate start,
            LocalDate end) {

        User user = userService.getUser(userId);

        List<Expense> expenses =
                expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
                        user, start, end);

        List<Income> incomes =
                incomeRepository.findByUserAndIncomeDateBetweenOrderByIncomeDateDesc(
                        user, start, end);

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet summary = workbook.createSheet("Summary");
            Sheet expenseSheet = workbook.createSheet("Expenses");
            Sheet incomeSheet = workbook.createSheet("Income");

            double totalIncome = incomes.stream()
                    .mapToDouble(i -> safe(i.getAmount()))
                    .sum();

            double totalExpense = expenses.stream()
                    .mapToDouble(e -> safe(e.getAmount()))
                    .sum();

            Row title = summary.createRow(0);
            title.createCell(0).setCellValue("Smart Expense Tracker Report");

            summary.createRow(1).createCell(0)
                    .setCellValue("User: " + user.getFullName());
            summary.createRow(2).createCell(0)
                    .setCellValue("Period: " + start + " to " + end);
            summary.createRow(3).createCell(0)
                    .setCellValue("Total Income: " + totalIncome);
            summary.createRow(4).createCell(0)
                    .setCellValue("Total Expense: " + totalExpense);
            summary.createRow(5).createCell(0)
                    .setCellValue("Balance: " + (totalIncome - totalExpense));

            createExpenseSheet(expenseSheet, expenses);
            createIncomeSheet(incomeSheet, incomes);

            for (int i = 0; i < 6; i++) {
                summary.autoSizeColumn(i);
            }

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            workbook.write(output);
            return output.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to create Excel report", e);
        }
    }

    public byte[] exportPdf(
            Long userId,
            LocalDate start,
            LocalDate end) {

        User user = userService.getUser(userId);

        List<Expense> expenses =
                expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
                        user, start, end);

        List<Income> incomes =
                incomeRepository.findByUserAndIncomeDateBetweenOrderByIncomeDateDesc(
                        user, start, end);

        double totalIncome = incomes.stream()
                .mapToDouble(i -> safe(i.getAmount()))
                .sum();

        double totalExpense = expenses.stream()
                .mapToDouble(e -> safe(e.getAmount()))
                .sum();

        List<String> lines = new ArrayList<>();

        lines.add("SMART EXPENSE TRACKER - FINANCIAL REPORT");
        lines.add("User: " + user.getFullName());
        lines.add("Period: " + start + " to " + end);
        lines.add("");
        lines.add("TOTAL INCOME: Rs. " + String.format("%.2f", totalIncome));
        lines.add("TOTAL EXPENSE: Rs. " + String.format("%.2f", totalExpense));
        lines.add("BALANCE: Rs. " +
                String.format("%.2f", totalIncome - totalExpense));
        lines.add("");
        lines.add("EXPENSES");
        lines.add("-----------------------------------------------");

        for (Expense e : expenses) {
            lines.add(
                    e.getExpenseDate() + " | " +
                    safeText(e.getCategory()) + " | " +
                    safeText(e.getTitle()) + " | Rs. " +
                    String.format("%.2f", safe(e.getAmount()))
            );
        }

        lines.add("");
        lines.add("INCOME");
        lines.add("-----------------------------------------------");

        for (Income i : incomes) {
            lines.add(
                    i.getIncomeDate() + " | " +
                    safeText(i.getSource()) + " | Rs. " +
                    String.format("%.2f", safe(i.getAmount()))
            );
        }

        try (PDDocument document = new PDDocument()) {

            PDType1Font regular =
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            PDType1Font bold =
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

            int index = 0;

            while (index < lines.size()) {

                PDPage page = new PDPage();
                document.addPage(page);

                try (PDPageContentStream stream =
                             new PDPageContentStream(document, page)) {

                    float y = 760;

                    while (index < lines.size() && y > 50) {

                        String text = sanitize(lines.get(index));

                        stream.beginText();
                        stream.setFont(
                                index == 0 ? bold : regular,
                                index == 0 ? 15 : 9
                        );
                        stream.newLineAtOffset(45, y);
                        stream.showText(text);
                        stream.endText();

                        y -= index == 0 ? 25 : 14;
                        index++;
                    }
                }
            }

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            document.save(output);
            return output.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to create PDF report", e);
        }
    }

    private void createExpenseSheet(
            Sheet sheet,
            List<Expense> expenses) {

        String[] columns = {
                "ID", "Date", "Title",
                "Category", "Description", "Amount"
        };

        Row header = sheet.createRow(0);

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;

        for (Expense e : expenses) {
            Row row = sheet.createRow(rowIndex++);

            row.createCell(0).setCellValue(
                    e.getExpenseId() == null
                            ? 0
                            : e.getExpenseId());

            row.createCell(1).setCellValue(
                    e.getExpenseDate().toString());

            row.createCell(2).setCellValue(
                    safeText(e.getTitle()));

            row.createCell(3).setCellValue(
                    safeText(e.getCategory()));

            row.createCell(4).setCellValue(
                    safeText(e.getDescription()));

            row.createCell(5).setCellValue(
                    safe(e.getAmount()));
        }

        autoSize(sheet, columns.length);
    }

    private void createIncomeSheet(
            Sheet sheet,
            List<Income> incomes) {

        String[] columns = {
                "ID", "Date", "Source", "Amount"
        };

        Row header = sheet.createRow(0);

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;

        for (Income i : incomes) {
            Row row = sheet.createRow(rowIndex++);

            row.createCell(0).setCellValue(
                    i.getIncomeId() == null
                            ? 0
                            : i.getIncomeId());

            row.createCell(1).setCellValue(
                    i.getIncomeDate().toString());

            row.createCell(2).setCellValue(
                    safeText(i.getSource()));

            row.createCell(3).setCellValue(
                    safe(i.getAmount()));
        }

        autoSize(sheet, columns.length);
    }

    private void autoSize(Sheet sheet, int columns) {
        for (int i = 0; i < columns; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }

    private String safeText(String value) {
        return value == null ? "" : value;
    }

    private String sanitize(String value) {
        return safeText(value)
                .replaceAll("[^\\x20-\\x7E]", "?");
    }
}
