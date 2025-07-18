package com.bamis.reclamations.service;

import com.bamis.reclamations.model.Destinataire;
import com.bamis.reclamations.repository.DestinataireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DestinataireService {

    @Autowired
    private DestinataireRepository destinataireRepository;

    public Destinataire save(Destinataire destinataire) {
        return destinataireRepository.save(destinataire);
    }

    public List<Destinataire> findAll() {
        return destinataireRepository.findAll();
    }

    public Optional<Destinataire> findById(Long id) {
        return destinataireRepository.findById(id);
    }

    public void deleteById(Long id) {
        destinataireRepository.deleteById(id);
    }

    public Destinataire update(Long id, Destinataire updated) {
        return destinataireRepository.findById(id).map(d -> {
            d.setNom(updated.getNom());
            d.setPrenom(updated.getPrenom());
            d.setEmail(updated.getEmail());
            d.setTelephone(updated.getTelephone());
            d.setService(updated.getService());
            d.setCategorie(updated.getCategorie());
            return destinataireRepository.save(d);
        }).orElseThrow(() -> new RuntimeException("Destinataire introuvable"));
    }
}
