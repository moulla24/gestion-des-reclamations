package com.bamis.reclamations.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // toute la classe nécessite rôle ADMIN
public class AdminController {

    @GetMapping("/dashboard")
    public String dashboardAdmin() {
        return "Bienvenue sur le tableau de bord admin 👑";
    }

    @DeleteMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable Long id) {
        // logiques pour supprimer un utilisateur par id
        return "Utilisateur avec ID " + id + " supprimé.";
    }
}
