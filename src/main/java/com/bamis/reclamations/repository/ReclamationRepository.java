package com.bamis.reclamations.repository;

import com.bamis.reclamations.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByUtilisateurId(Long utilisateurId);
    List<Reclamation> findByDestinataireId(Long destinataireId);
}
