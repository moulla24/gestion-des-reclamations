package com.bamis.reclamations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReclamationRequestDTO {

    @NotNull
    private Long categorieId;

    @NotBlank
    private String titre;

    @NotBlank
    private String description;

    private Long destinataireId;

    private String commentaire;

    // Priorité et statut sont optionnels (à adapter selon modèle)
    private String priorite;
    private String statut;

    // Getters et setters

}
