package com.hospital.doctor.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeSlotDTO {
    private LocalTime start;
    private LocalTime end;
    private boolean available;
}
