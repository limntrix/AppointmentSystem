package com.hospital.appointment.service;

import com.hospital.appointment.dto.AppointmentDTO;
import com.hospital.appointment.entity.Appointment;
import com.hospital.appointment.entity.AppointmentHistory;
import com.hospital.appointment.repository.AppointmentHistoryRepository;
import com.hospital.appointment.repository.AppointmentRepository;
import com.hospital.common.enums.AppointmentStatus;
import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import com.hospital.user.entity.Patient;
import com.hospital.user.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentHistoryRepository historyRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO dto) {
        // Validation check
        if (!appointmentRepository.findConflictingAppointments(dto.getDoctorId(), dto.getDate(), dto.getStartTime(), dto.getEndTime()).isEmpty()) {
            throw new RuntimeException("Slot is already booked");
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(dto.getDate());
        appointment.setStartTime(dto.getStartTime());
        appointment.setEndTime(dto.getEndTime());
        appointment.setStatus(AppointmentStatus.CREATED);
        appointment.setReason(dto.getReason());

        appointment = appointmentRepository.save(appointment);
        
        saveHistory(appointment, "Appointment Booked", "System");

        return mapToDTO(appointment);
    }

    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
        
        saveHistory(appointment, "Appointment Cancelled", "System");
    }

    private void saveHistory(Appointment app, String comment, String user) {
        AppointmentHistory history = new AppointmentHistory();
        history.setAppointment(app);
        history.setStatus(app.getStatus());
        history.setComments(comment);
        history.setUpdatedBy(user);
        historyRepository.save(history);
    }
    
    private AppointmentDTO mapToDTO(Appointment app) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(app.getId());
        dto.setDoctorId(app.getDoctor().getId());
        dto.setDoctorName(app.getDoctor().getUser().getFirstName() + " " + app.getDoctor().getUser().getLastName());
        dto.setPatientId(app.getPatient().getId());
        dto.setPatientName(app.getPatient().getUser().getFirstName() + " " + app.getPatient().getUser().getLastName());
        dto.setDate(app.getAppointmentDate());
        dto.setStartTime(app.getStartTime());
        dto.setEndTime(app.getEndTime());
        dto.setStatus(app.getStatus());
        dto.setReason(app.getReason());
        return dto;
    }

    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        // We need the actual patient entity ID, assuming the input is the User ID or Patient ID based on context.
        // For simplicity in this demo, let's assume the frontend passes the PATIENT ID (Table ID).
        // If frontend has UserID, we might need a lookup. Let's assume UserID for better UX.
        
        // Wait, the frontend stores UserID. So finding Patient by UserID is safer.
        Long pId = patientRepository.findByUserId(patientId)
                .map(Patient::getId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user: " + patientId));

        return appointmentRepository.findByPatientId(pId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
