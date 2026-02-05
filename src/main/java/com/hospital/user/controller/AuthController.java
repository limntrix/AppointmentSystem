package com.hospital.user.controller;

import com.hospital.user.dto.LoginRequest;
import com.hospital.user.entity.User;
import com.hospital.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final com.hospital.user.repository.PatientRepository patientRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real production app, use BCryptPasswordEncoder here
            if (user.getPassword().equals(request.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("name", user.getFirstName() + " " + user.getLastName());
                response.put("role", user.getRole());
                response.put("email", user.getEmail());
                
                if (user.getRole() == com.hospital.common.enums.UserRole.PATIENT) {
                    patientRepository.findByUserId(user.getId())
                        .ifPresent(patient -> response.put("patientId", patient.getId()));
                }
                
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
