package com.bamis.reclamations.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String titre;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private StatutReclamation statut;

    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    private Priorite  priorite;

    // Créateur de la réclamation
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    // Destinataire de la réclamation (doit être un utilisateur avec rôle ADMIN)
    @ManyToOne
    @JoinColumn(name = "destinataire_id")
    private Destinataire destinataire;

    // Catégorie de la réclamation
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    // Fichiers joints
    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL)
    private List<FichierJoint> fichiers;

    // Historique de suivi
    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL)
    private List<SuiviReclamation> suivis;

    // ======= Getters et Setters =======

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StatutReclamation getStatut() {
        return statut;
    }

    public void setStatut(StatutReclamation statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    public Priorite  getPriorite() {
        return priorite;
    }

    public void setPriorite(Priorite  priorite) {
        this.priorite = priorite;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Destinataire getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(Destinataire destinataire) {
        this.destinataire = destinataire;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public List<FichierJoint> getFichiers() {
        return fichiers;
    }

    public void setFichiers(List<FichierJoint> fichiers) {
        this.fichiers = fichiers;
    }

    public List<SuiviReclamation> getSuivis() {
        return suivis;
    }

    public void setSuivis(List<SuiviReclamation> suivis) {
        this.suivis = suivis;
    }

    // ======= Méthodes utiles =======

    public void changerStatut(StatutReclamation nouveauStatut) {
        this.statut = nouveauStatut;
    }


}
