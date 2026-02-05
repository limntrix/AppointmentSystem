package com.hospital.user.dto;

import com.hospital.common.enums.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private UserRole role;
    
    // For registration only
    private String password; 
}
