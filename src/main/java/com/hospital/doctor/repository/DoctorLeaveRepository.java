package com.hospital.doctor.repository;

import com.hospital.doctor.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {
    
    @Query("SELECT dl FROM DoctorLeave dl WHERE dl.doctor.id = :doctorId AND dl.approved = true AND " +
           "((:checkDate BETWEEN dl.startDate AND dl.endDate))")
    List<DoctorLeave> findApprovedLeavesForDoctorOnDate(@Param("doctorId") Long doctorId, @Param("checkDate") LocalDate checkDate);
}
