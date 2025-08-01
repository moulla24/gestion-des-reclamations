package com.bamis.reclamations.service.metier;

import com.bamis.reclamations.dto.ReclamationRequestDTO;
import com.bamis.reclamations.dto.ReclamationResponseDTO;
import com.bamis.reclamations.dto.SuiviReclamationResponseDTO;
import com.bamis.reclamations.model.*;
import com.bamis.reclamations.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReclamationMetierServiceImpl implements ReclamationMetierService {

    private final ReclamationRepository reclamationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CategorieRepository categorieRepository;
    private final DestinataireRepository destinataireRepository;
    private final SuiviReclamationRepository suiviReclamationRepository;

    @Override
    @Transactional
    public Reclamation soumettreReclamationPourEmail(String email, ReclamationRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Destinataire destinataire = destinataireRepository.findById(dto.getDestinataireId())
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));

        Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        Reclamation reclamation = new Reclamation();
        reclamation.setTitre(dto.getTitre());
        reclamation.setDescription(dto.getDescription());
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setDateModification(LocalDateTime.now());
        reclamation.setStatut(StatutReclamation.EN_ATTENTE);
        reclamation.setUtilisateur(utilisateur);
        reclamation.setDestinataire(destinataire);
        reclamation.setCategorie(categorie);

        return reclamationRepository.save(reclamation);
    }

    @Override
    public Optional<ReclamationResponseDTO> getById(Long id) {
        return reclamationRepository.findById(id).map(this::toResponseDTO);
    }

    @Override
    public List<ReclamationResponseDTO> getByEmail(String email) {
        return reclamationRepository.findByUtilisateurEmail(email).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReclamationResponseDTO> getAll() {
        return reclamationRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReclamationResponseDTO> getByUtilisateurId(Long utilisateurId) {
        return reclamationRepository.findByUtilisateurId(utilisateurId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReclamationResponseDTO> getByDestinataireId(Long destinataireId) {
        return reclamationRepository.findByDestinataireId(destinataireId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Reclamation mettreAJourReclamation(Reclamation reclamation, ReclamationRequestDTO dto) {
        StatutReclamation ancienStatut = reclamation.getStatut();

        // Mise à jour des champs
        if (dto.getTitre() != null && !dto.getTitre().isEmpty()) {
            reclamation.setTitre(dto.getTitre());
        }

        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) {
            reclamation.setDescription(dto.getDescription());
        }

        if (dto.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
            reclamation.setCategorie(categorie);
        }

        if (dto.getDestinataireId() != null) {
            Destinataire destinataire = destinataireRepository.findById(dto.getDestinataireId())
                    .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));
            reclamation.setDestinataire(destinataire);
        }

        // Mise à jour du statut et création du suivi
        if (dto.getStatut() != null) {
            StatutReclamation nouveauStatut = StatutReclamation.valueOf(dto.getStatut());

            if (!nouveauStatut.equals(ancienStatut)) {
                // Création de suivi uniquement si le statut change
                SuiviReclamation suivi = new SuiviReclamation();
                suivi.setAncienStatut(ancienStatut);
                suivi.setNouveauStatut(nouveauStatut);
                suivi.setDateModification(LocalDateTime.now());
                suivi.setCommentaire(dto.getCommentaire());
                suivi.setReclamation(reclamation);
                suiviReclamationRepository.save(suivi);
            }

            reclamation.setStatut(nouveauStatut);
        }

        reclamation.setDateModification(LocalDateTime.now());
        return reclamationRepository.save(reclamation);
    }
    public List<SuiviReclamationResponseDTO> getSuivisParReclamationId(Long reclamationId) {
        List<SuiviReclamation> suivis = suiviReclamationRepository.findByReclamationIdOrderByDateModificationDesc(reclamationId);
        return suivis.stream().map(suivi -> {
            SuiviReclamationResponseDTO dto = new SuiviReclamationResponseDTO();
            dto.setId(suivi.getId());
            dto.setAncienStatut(suivi.getAncienStatut().toString());
            dto.setNouveauStatut(suivi.getNouveauStatut().toString());
            dto.setCommentaire(suivi.getCommentaire());
            dto.setDateModification(suivi.getDateModification());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ReclamationResponseDTO toResponseDTO(Reclamation reclamation) {
        return ReclamationResponseDTO.builder()
                .id(reclamation.getId())
                .titre(reclamation.getTitre())
                .description(reclamation.getDescription())
                .statut(reclamation.getStatut().toString())
                .dateCreation(reclamation.getDateCreation())
                .nomUtilisateur(reclamation.getUtilisateur().getNom())
                .emailUtilisateur(reclamation.getUtilisateur().getEmail())
                .nomDestinataire(reclamation.getDestinataire().getNom())
                .categorie(reclamation.getCategorie().getLibelle())
                .build();
    }
}
