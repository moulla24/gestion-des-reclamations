package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.Destinataire;
import com.bamis.reclamations.service.DestinataireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/destinataires")
@CrossOrigin("*")
public class DestinataireController {

    @Autowired
    private DestinataireService destinataireService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Destinataire create(@RequestBody Destinataire destinataire) {
        return destinataireService.save(destinataire);
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('UTILISATEUR')")
    @GetMapping
    public List<Destinataire> getAll() {
        return destinataireService.findAll();
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('UTILISATEUR')")
    @GetMapping("/{id}")
    public Destinataire getById(@PathVariable Long id) {
        return destinataireService.findById(id)
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Destinataire update(@PathVariable Long id, @RequestBody Destinataire destinataire) {
        return destinataireService.update(id, destinataire);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        destinataireService.deleteById(id);
    }
}
