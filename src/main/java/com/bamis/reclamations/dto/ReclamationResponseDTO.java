package com.bamis.reclamations.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReclamationResponseDTO {
    private Long id;
    private String titre;
    private String description;
    private String statut;
    private LocalDateTime dateCreation;
    private String nomUtilisateur;
    private String emailUtilisateur;
    private String nomDestinataire;
    private String categorie;
}
