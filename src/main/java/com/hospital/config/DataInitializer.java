package com.hospital.config;

import com.hospital.common.enums.DayOfWeek;
import com.hospital.common.enums.UserRole;
import com.hospital.doctor.entity.Doctor;
import com.hospital.doctor.entity.DoctorAvailability;
import com.hospital.doctor.repository.DoctorAvailabilityRepository;
import com.hospital.doctor.repository.DoctorRepository;
import com.hospital.user.entity.Patient;
import com.hospital.user.entity.User;
import com.hospital.user.repository.PatientRepository;
import com.hospital.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final PatientRepository patientRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // 1. Create Doctor User
        User docUser = new User();
        docUser.setFirstName("Gregory");
        docUser.setLastName("House");
        docUser.setEmail("house@hospital.com");
        docUser.setPassword("password");
        docUser.setPhoneNumber("1234567890");
        docUser.setRole(UserRole.DOCTOR);
        userRepository.save(docUser);

        // 2. Create Doctor Profile
        Doctor doctor = new Doctor();
        doctor.setUser(docUser);
        doctor.setSpecialization("Diagnostician");
        doctor.setQualification("MD, John Hopkins");
        doctor.setExperienceYears(15);
        doctor.setLicenseNumber("MED-998877");
        doctor.setConsultationFee(150.0);
        doctor.setBio("Specializes in infectious diseases and nephrology.");
        doctor = doctorRepository.save(doctor);

        // 3. Create Availability (Mon-Fri, 9AM - 5PM)
        for (DayOfWeek day : Arrays.asList(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)) {
            DoctorAvailability avail = new DoctorAvailability();
            avail.setDoctor(doctor);
            avail.setDayOfWeek(day);
            avail.setStartTime(LocalTime.of(9, 0));
            avail.setEndTime(LocalTime.of(17, 0));
            avail.setSlotDurationMinutes(60); // 1 hour slots
            availabilityRepository.save(avail);
        }

        // 4. Create Patient User
        User patUser = new User();
        patUser.setFirstName("John");
        patUser.setLastName("Doe");
        patUser.setEmail("john@gmail.com");
        patUser.setPassword("password");
        patUser.setPhoneNumber("0987654321");
        patUser.setRole(UserRole.PATIENT);
        userRepository.save(patUser);

        // 5. Create Patient Profile
        Patient patient = new Patient();
        patient.setUser(patUser);
        patient.setDateOfBirth(LocalDate.of(1990, 5, 15));
        patient.setGender("Male");
        patient.setAddress("221B Baker Street");
        patient.setBloodGroup("O+");
        patientRepository.save(patient);

        System.out.println("Data Initialization Completed!");
    }
}
