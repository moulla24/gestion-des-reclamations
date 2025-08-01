package com.bamis.reclamations.repository;

import com.bamis.reclamations.model.FichierJoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FichierJointRepository extends JpaRepository<FichierJoint, Long> {
    List<FichierJoint> findByReclamationId(Long reclamationId);
}
