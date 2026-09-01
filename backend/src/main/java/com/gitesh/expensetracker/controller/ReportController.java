package com.gitesh.expensetracker.controller;

import com.gitesh.expensetracker.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/excel/{userId}")
    public ResponseEntity<byte[]> excel(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        validate(startDate, endDate);

        byte[] file =
                reportService.exportExcel(userId, startDate, endDate);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=financial-report.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/pdf/{userId}")
    public ResponseEntity<byte[]> pdf(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        validate(startDate, endDate);

        byte[] file =
                reportService.exportPdf(userId, startDate, endDate);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=financial-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    private void validate(LocalDate start, LocalDate end) {
        if (start == null || end == null || start.isAfter(end)) {
            throw new RuntimeException(
                    "Start date must be before or equal to end date");
        }
    }
}
