package com.smartlogix.bff.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardDTO {
    private KpisDTO kpis;
    private List<PedidoDTO> recentOrders;
    private List<StockAlertDTO> stockAlerts;
    private List<ActivityEventDTO> activityFeed;
}
