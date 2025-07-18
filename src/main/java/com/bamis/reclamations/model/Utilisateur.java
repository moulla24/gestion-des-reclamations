package com.bamis.reclamations.model;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
    private String email; // correspondra à username dans UserDetails
    
    private String motDePasse;
    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean actif;

    @OneToMany(mappedBy = "utilisateur")
    private List<Reclamation> reclamationsCreees;

    // --- Constructeurs

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

    // --- Getters / Setters

    public void setId(Long id) { this.id = id; }
    public Long getId() { return id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public List<Reclamation> getReclamationsCreees() { return reclamationsCreees; }
    public void setReclamationsCreees(List<Reclamation> reclamationsCreees) { this.reclamationsCreees = reclamationsCreees; }

    // --- Méthodes métiers

    public void changerMotDePasse(String nouveauMdp) {
        this.motDePasse = nouveauMdp;
    }

    public boolean estAdministrateur() {
        return this.role == Role.ADMIN;
    }

    // --- Implémentation UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // On crée une autorité ROLE_XXX à partir de l'enum Role
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
        return true;  // Pour l’instant, on considère que le compte n’expire jamais
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // On considère que le compte n’est jamais bloqué
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // On considère que les identifiants ne expirent pas
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(this.actif);  // On utilise le champ actif pour savoir si le compte est activé
    }
}
