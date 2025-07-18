package com.bamis.reclamations.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("DESTINATAIRE")
public class Destinataire extends Utilisateur {

    private String service;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    public Destinataire() {}

    public Destinataire(String nom, String prenom, String email, String motDePasse, String telephone, Role role, Boolean actif, String service, Categorie categorie) {
        super(nom, prenom, email, motDePasse, telephone, role, actif);
        this.service = service;
        this.categorie = categorie;
    }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }

    public String getNomComplet() {
        return getNom() + " " + getPrenom();
    }
}
