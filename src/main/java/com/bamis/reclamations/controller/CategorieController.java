package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.Categorie;
import com.bamis.reclamations.service.CategorieService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/categories")
@CrossOrigin("*")
public class CategorieController {

    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('UTILISATEUR')")
    @GetMapping
    public List<Categorie> getAllCategories() {
        return categorieService.findAll();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        return categorieService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieService.save(categorie);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie updated) {
        return categorieService.findById(id).map(categorie -> {
            categorie.setLibelle(updated.getLibelle());
            categorie.setDescription(updated.getDescription());
            categorie.setActif(updated.getActif());
            return ResponseEntity.ok(categorieService.save(categorie));
        }).orElse(ResponseEntity.notFound().build());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        if (categorieService.findById(id).isPresent()) {
            categorieService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
