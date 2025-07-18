package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.Utilisateur;
import com.bamis.reclamations.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin("*")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        return utilisateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Utilisateur createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.save(utilisateur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable Long id, @RequestBody Utilisateur updated) {
        return utilisateurService.findById(id).map(utilisateur -> {
            utilisateur.setNom(updated.getNom());
            utilisateur.setPrenom(updated.getPrenom());
            utilisateur.setEmail(updated.getEmail());
            utilisateur.setTelephone(updated.getTelephone());
            utilisateur.setMotDePasse(updated.getMotDePasse());
            utilisateur.setRole(updated.getRole());
            utilisateur.setActif(updated.getActif());
            return ResponseEntity.ok(utilisateurService.save(utilisateur));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        if (utilisateurService.findById(id).isPresent()) {
            utilisateurService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
