package com.smartlogix.bff.service;

import com.smartlogix.bff.dto.DashboardDTO;
import com.smartlogix.bff.dto.KpisDTO;

public interface BffService {
    KpisDTO obtenerKpis();
    DashboardDTO obtenerDashboard();
}
