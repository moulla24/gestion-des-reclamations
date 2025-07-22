package com.bamis.reclamations.controller;

import com.bamis.reclamations.dto.ReclamationRequestDTO;
import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.model.Utilisateur;
import com.bamis.reclamations.service.ReclamationService;
import com.bamis.reclamations.service.UtilisateurService;
import com.bamis.reclamations.service.metier.ReclamationMetierService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/reclamations")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ReclamationController {

    private final ReclamationService reclamationService;
    private final UtilisateurService utilisateurService;
    private final ReclamationMetierService reclamationMetierService;
    /**
     * ADMIN et UTILISATEUR : Voir toutes les réclamations (utile pour tests ou debug)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Reclamation> getAllReclamations() {
        return reclamationService.findAll();
    }

    /**
     * UTILISATEUR connecté : Voir ses propres réclamations
     */
    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @GetMapping("/mes-reclamations")
    public ResponseEntity<List<Reclamation>> getMesReclamations(Authentication authentication) {
        String email = authentication.getName();
        List<Reclamation> reclamations = reclamationService.findByUtilisateurEmail(email);
        return ResponseEntity.ok(reclamations);
    }

    /**
     * ADMIN : Obtenir une réclamation par ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getById(@PathVariable Long id) {
        return reclamationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * UTILISATEUR : Créer une réclamation liée à l'utilisateur connecté
     */
    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Reclamation> create(Authentication authentication, @RequestBody Reclamation reclamation) {
        String email = authentication.getName();
        Optional<Utilisateur> utilisateurOpt = utilisateurService.findByEmail(email);
        if (utilisateurOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        reclamation.setUtilisateur(utilisateurOpt.get());
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setDateModification(LocalDateTime.now());
        Reclamation saved = reclamationService.save(reclamation);
        return ResponseEntity.ok(saved);
    }

    /**
     * UTILISATEUR ou ADMIN : Mettre à jour une réclamation
     */
    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Reclamation> update(
            @PathVariable Long id,
            @RequestBody Reclamation updated,
            Authentication authentication
    ) {
        Optional<Reclamation> existingOpt = reclamationService.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reclamation reclamation = existingOpt.get();

        // Optionnel : Vérifier que l'utilisateur connecté est propriétaire ou admin
        String email = authentication.getName();
        if (!reclamation.getUtilisateur().getEmail().equals(email) &&
                !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }

        reclamation.setTitre(updated.getTitre());
        reclamation.setDescription(updated.getDescription());
        reclamation.setPriorite(updated.getPriorite());
        reclamation.setStatut(updated.getStatut());
        reclamation.setCategorie(updated.getCategorie());
        reclamation.setDestinataire(updated.getDestinataire());
        reclamation.setDateModification(LocalDateTime.now());

        return ResponseEntity.ok(reclamationService.save(reclamation));
    }

    /**
     * ADMIN : Supprimer une réclamation
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (reclamationService.findById(id).isPresent()) {
            reclamationService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * ADMIN : Réclamations d’un utilisateur donné
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/utilisateur/{userId}")
    public List<Reclamation> getByUtilisateur(@PathVariable Long userId) {
        return reclamationService.findByUtilisateurId(userId);
    }

    /**
     * ADMIN : Réclamations destinées à un destinataire donné
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/destinataire/{adminId}")
    public List<Reclamation> getByDestinataire(@PathVariable Long adminId) {
        return reclamationService.findByDestinataireId(adminId);
    }


    @PostMapping("/soumettre")
   @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    public ResponseEntity<Reclamation> soumettreReclamation(@RequestBody ReclamationRequestDTO dto) {
        Reclamation nouvelleReclamation = reclamationMetierService.soumettreReclamation(dto);
        return ResponseEntity.ok(nouvelleReclamation);
}


}
