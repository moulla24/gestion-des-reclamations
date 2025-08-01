package com.bamis.reclamations.controller;

import com.bamis.reclamations.dto.ChangerStatutDTO;
import com.bamis.reclamations.dto.ReclamationRequestDTO;
import com.bamis.reclamations.dto.ReclamationResponseDTO;
import com.bamis.reclamations.dto.SuiviReclamationResponseDTO;
import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.model.StatutReclamation;
import com.bamis.reclamations.service.ReclamationService;
import com.bamis.reclamations.service.metier.ReclamationMetierService;
import com.bamis.reclamations.service.metier.ReclamationMetierServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/reclamations")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ReclamationController {

    private final ReclamationService reclamationService;
    private final ReclamationMetierService reclamationMetierService;
    private final ReclamationMetierServiceImpl reclamationMetierServiceImpl;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ReclamationResponseDTO>> getAllReclamations() {
        return ResponseEntity.ok(reclamationMetierService.getAll());
    }

    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @PostMapping("/soumettre")
    public ResponseEntity<ReclamationResponseDTO> soumettreReclamation(
            @Valid @RequestBody ReclamationRequestDTO dto,
            Authentication auth
    ) {
        String email = auth.getName();
        Reclamation created = reclamationMetierService.soumettreReclamationPourEmail(email, dto);
        return ResponseEntity.ok(reclamationMetierService.toResponseDTO(created));
    }

    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @GetMapping("/mes-reclamations")
    public ResponseEntity<List<ReclamationResponseDTO>> getMesReclamations(Authentication authentication) {
        String email = authentication.getName();
        List<ReclamationResponseDTO> result = reclamationMetierService.getByEmail(email);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ReclamationResponseDTO> getById(@PathVariable Long id) {
        Optional<ReclamationResponseDTO> dtoOpt = reclamationMetierService.getById(id);
        return dtoOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ReclamationResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ReclamationRequestDTO dto,
            Authentication authentication
    ) {
        Optional<Reclamation> existingOpt = reclamationService.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reclamation reclamation = existingOpt.get();
        String email = authentication.getName();

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Seul l'admin ou le créateur peuvent modifier
        if (!isAdmin && !reclamation.getUtilisateur().getEmail().equals(email)) {
            return ResponseEntity.status(403).build();
        }

        Reclamation updated = reclamationMetierService.mettreAJourReclamation(reclamation, dto);
        return ResponseEntity.ok(reclamationMetierService.toResponseDTO(updated));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (reclamationService.findById(id).isPresent()) {
            reclamationService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/utilisateur/{userId}")
    public ResponseEntity<List<ReclamationResponseDTO>> getByUtilisateur(@PathVariable Long userId) {
        return ResponseEntity.ok(reclamationMetierService.getByUtilisateurId(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/destinataire/{adminId}")
    public ResponseEntity<List<ReclamationResponseDTO>> getByDestinataire(@PathVariable Long adminId) {
        return ResponseEntity.ok(reclamationMetierService.getByDestinataireId(adminId));
    }
    @PutMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable Long id,
            @RequestBody ChangerStatutDTO dto
    ) {
        try {
            // Vérifie que la réclamation existe
            Optional<Reclamation> optionalReclamation = reclamationService.getById(id);
            if (optionalReclamation.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Réclamation avec ID " + id + " non trouvée.");
            }

            // Conversion de la chaîne en enum
            StatutReclamation nouveauStatut;
            try {
                nouveauStatut = StatutReclamation.valueOf(dto.getNouveauStatut().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Statut invalide : " + dto.getNouveauStatut());
            }

            // Mise à jour du statut
            Reclamation updated = reclamationService.mettreAJourStatut(id, nouveauStatut);

            // Conversion en DTO
            ReclamationResponseDTO responseDTO = reclamationMetierService.toResponseDTO(updated);
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du changement de statut : " + e.getMessage());
        }
    }
    @GetMapping("/{id}/suivi")
    @PreAuthorize("hasAnyRole('UTILISATEUR', 'ADMIN')")
    public ResponseEntity<List<SuiviReclamationResponseDTO>> getHistoriqueSuivi(@PathVariable Long id, Authentication auth) {
        // Vérifier que l'utilisateur a accès à cette réclamation (admin ou propriétaire)
        Optional<ReclamationResponseDTO> reclamationOpt = reclamationMetierService.getById(id);
        if (reclamationOpt.isEmpty()) return ResponseEntity.notFound().build();

        ReclamationResponseDTO reclamation = reclamationOpt.get();
        String email = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !reclamation.getEmailUtilisateur().equals(email)) {
            return ResponseEntity.status(403).build();
        }

        List<SuiviReclamationResponseDTO> suivis = reclamationMetierServiceImpl.getSuivisParReclamationId(id);
        return ResponseEntity.ok(suivis);
    }


}



