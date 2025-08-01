package com.bamis.reclamations.controller;

import com.bamis.reclamations.model.FichierJoint;
import com.bamis.reclamations.service.FichierJointService;
import org.springframework.core.io.Resource;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/fichiers")
@RequiredArgsConstructor
public class FichierJointController {

    private final FichierJointService fichierJointService;

    @PostMapping("/upload/{reclamationId}")
    public ResponseEntity<String> uploadFichier(
            @PathVariable Long reclamationId,
            @RequestParam("file") MultipartFile file) {
        try {
            FichierJoint fichier = fichierJointService.enregistrerFichier(reclamationId, file);
            return ResponseEntity.ok("Fichier enregistré : " + fichier.getNomFichier());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/telecharger/{id}")
    public ResponseEntity<Resource> telechargerFichier(@PathVariable Long id) {
        FichierJoint fichierJoint = fichierJointService.getFichierJointById(id);
        Path cheminFichier = Paths.get(fichierJoint.getCheminFichier());

        Resource resource;
        try {
            resource = new UrlResource(cheminFichier.toUri());
            if (!resource.exists()) {
                throw new RuntimeException("Fichier non trouvé : " + fichierJoint.getNomFichier());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erreur lors de l'accès au fichier", e);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fichierJoint.getTypeMime()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fichierJoint.getNomFichier() + "\"")
                .body(resource);
    }
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) throws Exception {
        fichierJointService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

}

