package com.bamis.reclamations.repository;

import com.bamis.reclamations.model.Destinataire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinataireRepository extends JpaRepository<Destinataire, Long> {
    // Tu peux ajouter des méthodes personnalisées ici si nécessaire
}
