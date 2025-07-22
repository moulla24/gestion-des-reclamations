package com.bamis.reclamations.service;

import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.model.Utilisateur;
import com.bamis.reclamations.repository.ReclamationRepository;
import com.bamis.reclamations.repository.UtilisateurRepository;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ReclamationService(ReclamationRepository reclamationRepository, UtilisateurRepository utilisateurRepository) {
        this.reclamationRepository = reclamationRepository;
        this.utilisateurRepository = utilisateurRepository;
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
    public List<Reclamation> findByUtilisateur(Utilisateur utilisateur) {
        return reclamationRepository.findByUtilisateur(utilisateur);
    }
     public List<Reclamation> findByUtilisateurEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable avec email : " + email));
        return reclamationRepository.findByUtilisateur(utilisateur);
    }
}
