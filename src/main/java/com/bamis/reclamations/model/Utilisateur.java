package com.bamis.reclamations.model;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type_utilisateur")
@Entity
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    private String motDePasse;
    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean actif = true;

    @OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Reclamation> reclamationsCreees;

    // --- Constructeurs ---

    public Utilisateur() {}

    public Utilisateur(String nom, String prenom, String email, String motDePasse, String telephone, Role role, Boolean actif) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.telephone = telephone;
        this.role = role;
        this.actif = actif;
    }

    // --- Getters et Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public List<Reclamation> getReclamationsCreees() {
        return reclamationsCreees;
    }

    public void setReclamationsCreees(List<Reclamation> reclamationsCreees) {
        this.reclamationsCreees = reclamationsCreees;
    }

    // --- Méthodes métiers ---

    public void changerMotDePasse(String nouveauMotDePasse) {
        this.motDePasse = nouveauMotDePasse;
    }

    public boolean estAdministrateur() {
        return this.role == Role.ADMIN;
    }

    // --- Implémentation de UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getPassword() {
        return this.motDePasse;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(this.actif);
    }
}
