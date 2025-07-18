package com.bamis.reclamations.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String libelle;
    private String description;
    private Boolean actif;

    // --- Relations
    @OneToMany(mappedBy = "categorie")
    private List<Reclamation> reclamations;

    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL)
private List<Destinataire> destinataires = new ArrayList<>();


    // --- Constructeurs

    public Categorie() {}

    public Categorie(String libelle, String description, Boolean actif) {
        this.libelle = libelle;
        this.description = description;
        this.actif = actif;
    }

    // --- Getters / Setters

    public Long getId() { return id; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public List<Reclamation> getReclamations() { return reclamations; }
    public void setReclamations(List<Reclamation> reclamations) { this.reclamations = reclamations; }

    public List<Destinataire> getDestinataires() { return destinataires; }
    public void setDestinataires(List<Destinataire> destinataires) { this.destinataires = destinataires; }
}
