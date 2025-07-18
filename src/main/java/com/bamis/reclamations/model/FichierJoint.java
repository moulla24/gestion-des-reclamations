package com.bamis.reclamations.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class FichierJoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;
    private String cheminFichier;
    private String typeMime;
    private Long tailleFichier;
    private LocalDateTime dateUpload;

    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    private Reclamation reclamation;

    // --- Constructeurs

    public FichierJoint() {}

    public FichierJoint(String nomFichier, String cheminFichier, String typeMime, Long tailleFichier, LocalDateTime dateUpload, Reclamation reclamation) {
        this.nomFichier = nomFichier;
        this.cheminFichier = cheminFichier;
        this.typeMime = typeMime;
        this.tailleFichier = tailleFichier;
        this.dateUpload = dateUpload;
        this.reclamation = reclamation;
    }

    // --- Getters / Setters

    public Long getId() { return id; }

    public String getNomFichier() { return nomFichier; }
    public void setNomFichier(String nomFichier) { this.nomFichier = nomFichier; }

    public String getCheminFichier() { return cheminFichier; }
    public void setCheminFichier(String cheminFichier) { this.cheminFichier = cheminFichier; }

    public String getTypeMime() { return typeMime; }
    public void setTypeMime(String typeMime) { this.typeMime = typeMime; }

    public Long getTailleFichier() { return tailleFichier; }
    public void setTailleFichier(Long tailleFichier) { this.tailleFichier = tailleFichier; }

    public LocalDateTime getDateUpload() { return dateUpload; }
    public void setDateUpload(LocalDateTime dateUpload) { this.dateUpload = dateUpload; }

    public Reclamation getReclamation() { return reclamation; }
    public void setReclamation(Reclamation reclamation) { this.reclamation = reclamation; }

    // --- Méthodes métiers

    public boolean estImage() {
        if (typeMime == null) return false;
        return typeMime.startsWith("image/");
    }
}
