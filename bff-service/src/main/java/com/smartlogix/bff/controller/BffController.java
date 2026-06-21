package com.smartlogix.bff.controller;

import com.smartlogix.bff.dto.DashboardDTO;
import com.smartlogix.bff.dto.KpisDTO;
import com.smartlogix.bff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bff")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;

    @GetMapping("/kpis")
    public ResponseEntity<KpisDTO> obtenerKpis() {
        return ResponseEntity.ok(bffService.obtenerKpis());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> obtenerDashboard() {
        return ResponseEntity.ok(bffService.obtenerDashboard());
    }
}
