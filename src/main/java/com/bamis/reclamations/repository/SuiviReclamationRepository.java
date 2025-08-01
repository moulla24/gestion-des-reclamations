package com.bamis.reclamations.repository;

import com.bamis.reclamations.model.SuiviReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuiviReclamationRepository extends JpaRepository<SuiviReclamation, Long> {
    List<SuiviReclamation> findByReclamationId(Long reclamationId);
    List<SuiviReclamation> findByReclamationIdOrderByDateModificationDesc(Long reclamationId);
}
