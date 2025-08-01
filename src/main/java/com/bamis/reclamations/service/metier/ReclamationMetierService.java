package com.bamis.reclamations.service.metier;

import com.bamis.reclamations.dto.ReclamationRequestDTO;
import com.bamis.reclamations.dto.ReclamationResponseDTO;
import com.bamis.reclamations.model.Reclamation;

import java.util.List;
import java.util.Optional;

public interface ReclamationMetierService {
    Reclamation soumettreReclamationPourEmail(String email, ReclamationRequestDTO dto);
    Optional<ReclamationResponseDTO> getById(Long id);
    List<ReclamationResponseDTO> getByEmail(String email);
    List<ReclamationResponseDTO> getAll();
    List<ReclamationResponseDTO> getByUtilisateurId(Long utilisateurId);
    List<ReclamationResponseDTO> getByDestinataireId(Long destinataireId);
    Reclamation mettreAJourReclamation(Reclamation reclamation, ReclamationRequestDTO dto);
    ReclamationResponseDTO toResponseDTO(Reclamation reclamation);
}
