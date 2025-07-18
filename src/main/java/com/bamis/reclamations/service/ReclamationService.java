package com.bamis.reclamations.service;

import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.repository.ReclamationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;

    public ReclamationService(ReclamationRepository reclamationRepository) {
        this.reclamationRepository = reclamationRepository;
    }

    public List<Reclamation> findAll() {
        return reclamationRepository.findAll();
    }

    public Optional<Reclamation> findById(Long id) {
        return reclamationRepository.findById(id);
    }

    public Reclamation save(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }

    public void deleteById(Long id) {
        reclamationRepository.deleteById(id);
    }

    public List<Reclamation> findByUtilisateurId(Long userId) {
        return reclamationRepository.findByUtilisateurId(userId);
    }

    public List<Reclamation> findByDestinataireId(Long adminId) {
        return reclamationRepository.findByDestinataireId(adminId);
    }
}
