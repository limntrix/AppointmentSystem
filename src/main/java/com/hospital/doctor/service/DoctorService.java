package com.hospital.doctor.service;

import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.common.enums.DayOfWeek;
import com.hospital.doctor.dto.TimeSlotDTO;
import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.entity.DoctorAvailability;
import com.hospital.doctor.repository.DoctorAvailabilityRepository;
import com.hospital.doctor.repository.DoctorLeaveRepository;
import com.hospital.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorLeaveRepository leaveRepository;
    private final AppointmentRepository appointmentRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<TimeSlotDTO> getAvailableSlots(Long doctorId, LocalDate date) {
        // 1. Check if doctor is on leave
        if (!leaveRepository.findApprovedLeavesForDoctorOnDate(doctorId, date).isEmpty()) {
            return new ArrayList<>(); // No slots available if on leave
        }

        // 2. Get weekly schedule for that day
        DayOfWeek dayOfWeek = DayOfWeek.valueOf(date.getDayOfWeek().name());
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);

        List<TimeSlotDTO> slots = new ArrayList<>();

        for (DoctorAvailability availability : availabilities) {
            LocalTime current = availability.getStartTime();
            LocalTime end = availability.getEndTime();
            int duration = availability.getSlotDurationMinutes();

            while (current.plusMinutes(duration).isBefore(end) || current.plusMinutes(duration).equals(end)) {
                LocalTime next = current.plusMinutes(duration);
                
                // 3. Check for conflict with existing appointments
                boolean conflict = !appointmentRepository.findConflictingAppointments(doctorId, date, current, next).isEmpty();

                TimeSlotDTO slot = new TimeSlotDTO();
                slot.setStart(current);
                slot.setEnd(next);
                slot.setAvailable(!conflict);
                slots.add(slot);

                current = next;
            }
        }
        return slots;
    }
}
