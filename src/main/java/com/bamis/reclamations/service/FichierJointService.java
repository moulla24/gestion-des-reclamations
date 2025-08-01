package com.bamis.reclamations.service;

import com.bamis.reclamations.model.FichierJoint;
import com.bamis.reclamations.model.Reclamation;
import com.bamis.reclamations.repository.FichierJointRepository;
import com.bamis.reclamations.repository.ReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FichierJointService {

    private final FichierJointRepository fichierJointRepository;
    private final ReclamationRepository reclamationRepository;

    private final String UPLOAD_DIR = "C:\\Users\\moull\\Documents\\reclamations\\uploads/";

    public FichierJoint enregistrerFichier(Long reclamationId, MultipartFile file) throws IOException {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;

        File destFile = new File(filePath);
        destFile.getParentFile().mkdirs(); // Création du dossier si inexistant
        file.transferTo(destFile);

        FichierJoint fichierJoint = new FichierJoint(
                file.getOriginalFilename(),
                filePath,
                file.getContentType(),
                file.getSize(),
                LocalDateTime.now(),
                reclamation
        );

        return fichierJointRepository.save(fichierJoint);
    }

    public byte[] telechargerFichier(Long fichierId) throws IOException {
        FichierJoint fichierJoint = fichierJointRepository.findById(fichierId)
                .orElseThrow(() -> new RuntimeException("Fichier introuvable"));

        return java.nio.file.Files.readAllBytes(new File(fichierJoint.getCheminFichier()).toPath());
    }
    public FichierJoint getFichierJointById(Long id) {
        return fichierJointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fichier joint non trouvé avec l'id : " + id));
    }

    public byte[] getFileContent(Long fichierId) throws Exception {
        FichierJoint fichier = fichierJointRepository.findById(fichierId)
                .orElseThrow(() -> new Exception("Fichier non trouvé"));
        Path path = Paths.get(fichier.getCheminFichier());
        return Files.readAllBytes(path);
    }


    public void deleteFile(Long fichierId) throws Exception {
        FichierJoint fichier = fichierJointRepository.findById(fichierId)
                .orElseThrow(() -> new Exception("Fichier non trouvé"));
        Path path = Paths.get(fichier.getCheminFichier());
        Files.deleteIfExists(path);
        fichierJointRepository.delete(fichier);
    }
}
