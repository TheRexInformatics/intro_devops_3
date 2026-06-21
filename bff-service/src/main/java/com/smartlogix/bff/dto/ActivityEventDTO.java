package com.smartlogix.bff.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityEventDTO {
    private Long id;
    private String type;
    private String msg;
    private String time;
}
