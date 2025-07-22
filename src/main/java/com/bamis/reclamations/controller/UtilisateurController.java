package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.Utilisateur;
import com.bamis.reclamations.service.UtilisateurService;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.bamis.reclamations.model.Role; 

import java.util.List;

@RestController
@RequestMapping("/api/admin/utilisateurs")
@CrossOrigin("*")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.findAll();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        if (utilisateurService.findById(id).isPresent()) {
            utilisateurService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/{id}/role")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
    Optional<Utilisateur> utilisateurOpt = utilisateurService.findById(id);

    if (utilisateurOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Utilisateur utilisateur = utilisateurOpt.get();
    try {
        utilisateur.setRole(Role.valueOf(role.toUpperCase()));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Rôle invalide : " + role);
    }

    return ResponseEntity.ok(utilisateurService.save(utilisateur));
}


}
