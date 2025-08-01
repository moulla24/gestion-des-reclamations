package com.bamis.reclamations.controller;

import com.bamis.reclamations.security.AuthenticationRequest;
import com.bamis.reclamations.security.AuthenticationResponse;
import com.bamis.reclamations.security.JwtService;
import com.bamis.reclamations.service.UtilisateurService;
import com.bamis.reclamations.model.Utilisateur;
import com.bamis.reclamations.model.Role;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurService utilisateurService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UtilisateurService utilisateurService,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.utilisateurService = utilisateurService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // Endpoint inscription
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest request) {
        if (utilisateurService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setRole(Role.UTILISATEUR);  // par défaut
        utilisateur.setActif(true);

        utilisateurService.save(utilisateur);

        String jwtToken = jwtService.generateToken(utilisateur);

        return ResponseEntity.ok(new AuthenticationResponse(jwtToken));
    }

    // Endpoint connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        System.out.println("Tentative login: " + request.getEmail());
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
            );
        } catch (Exception ex) {
            ex.printStackTrace(); // Ajoute ceci pour voir l’erreur exacte
            return ResponseEntity.status(401).body("Email ou mot de passe invalide");
        }

        Utilisateur utilisateur = utilisateurService.findByEmail(request.getEmail()).get();
        String jwtToken = jwtService.generateToken(utilisateur);

        return ResponseEntity.ok(new AuthenticationResponse(jwtToken));
    }
}
