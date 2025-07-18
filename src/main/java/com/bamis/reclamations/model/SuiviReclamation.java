package com.bamis.reclamations.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SuiviReclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private StatutReclamation ancienStatut;

    @Enumerated(EnumType.STRING)
    private StatutReclamation nouveauStatut;

    @Column(length = 2000)
    private String commentaire;

    private LocalDateTime dateModification;

    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    private Reclamation reclamation;

    // --- Constructeurs

    public SuiviReclamation() {}

    public SuiviReclamation(StatutReclamation ancienStatut, StatutReclamation nouveauStatut, String commentaire, LocalDateTime dateModification, Reclamation reclamation) {
        this.ancienStatut = ancienStatut;
        this.nouveauStatut = nouveauStatut;
        this.commentaire = commentaire;
        this.dateModification = dateModification;
        this.reclamation = reclamation;
    }

    // --- Getters / Setters

    public Long getId() { return id; }

    public StatutReclamation getAncienStatut() { return ancienStatut; }
    public void setAncienStatut(StatutReclamation ancienStatut) { this.ancienStatut = ancienStatut; }

    public StatutReclamation getNouveauStatut() { return nouveauStatut; }
    public void setNouveauStatut(StatutReclamation nouveauStatut) { this.nouveauStatut = nouveauStatut; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }

    public LocalDateTime getDateModification() { return dateModification; }
    public void setDateModification(LocalDateTime dateModification) { this.dateModification = dateModification; }

    public Reclamation getReclamation() { return reclamation; }
    public void setReclamation(Reclamation reclamation) { this.reclamation = reclamation; }

    // --- Méthode métier

    public String getDescriptionModification() {
        return "Statut changé de " + ancienStatut + " à " + nouveauStatut + " le " + dateModification + (commentaire != null ? ". Commentaire: " + commentaire : "");
    }
}
