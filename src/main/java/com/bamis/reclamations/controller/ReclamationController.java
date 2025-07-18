package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.service.ReclamationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin("*")
public class ReclamationController {

    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    @GetMapping
    public List<Reclamation> getAll() {
        return reclamationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getById(@PathVariable Long id) {
        return reclamationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reclamation create(@RequestBody Reclamation reclamation) {
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setDateModification(LocalDateTime.now());
        return reclamationService.save(reclamation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> update(@PathVariable Long id, @RequestBody Reclamation updated) {
        return reclamationService.findById(id).map(reclamation -> {
            reclamation.setTitre(updated.getTitre());
            reclamation.setDescription(updated.getDescription());
            reclamation.setPriorite(updated.getPriorite());
            reclamation.setStatut(updated.getStatut());
            reclamation.setDateModification(LocalDateTime.now());
            reclamation.setCategorie(updated.getCategorie());
            reclamation.setDestinataire(updated.getDestinataire());
            return ResponseEntity.ok(reclamationService.save(reclamation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (reclamationService.findById(id).isPresent()) {
            reclamationService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/utilisateur/{userId}")
    public List<Reclamation> getByUtilisateur(@PathVariable Long userId) {
        return reclamationService.findByUtilisateurId(userId);
    }

    @GetMapping("/destinataire/{adminId}")
    public List<Reclamation> getByDestinataire(@PathVariable Long adminId) {
        return reclamationService.findByDestinataireId(adminId);
    }
}
