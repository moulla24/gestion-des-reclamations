# Exigences Backend pour les Fichiers Joints

## Problèmes Identifiés

### 1. Upload de Fichiers
- **Endpoint**: `POST /api/fichiers/upload/{reclamationId}`
- **Format**: `multipart/form-data`
- **Champ**: `file`
- **Problème actuel**: L'upload fonctionne mais les fichiers ne sont pas récupérés avec les réclamations

### 2. Récupération des Fichiers Joints
- **Endpoint**: `GET /api/user/reclamations/{id}/fichiers`
- **Problème actuel**: Les fichiers joints ne sont pas inclus dans la réponse de `GET /api/user/reclamations`

### 3. Réponse des Réclamations
- **Endpoint**: `GET /api/user/reclamations`
- **Problème actuel**: La réponse ne contient pas le champ `fichiersJoints`

## Solutions Requises

### 1. Modifier la Réponse des Réclamations
```json
{
  "id": 1,
  "titre": "Titre de la réclamation",
  "description": "Description",
  "dateCreation": "2024-01-01T10:00:00",
  "statut": "EN_ATTENTE",
  "emailUtilisateur": "user@example.com",
  "nomCategorie": "Catégorie",
  "nomDestinataire": "Destinataire",
  "fichiersJoints": [
    {
      "id": 1,
      "nomFichier": "document.pdf",
      "cheminFichier": "http://localhost:8080/api/fichiers/download/1",
      "typeMime": "application/pdf",
      "tailleFichier": 1024000,
      "dateUpload": "2024-01-01T10:00:00"
    }
  ]
}
```

### 2. Endpoint de Téléchargement
- **Endpoint**: `GET /api/fichiers/download/{fichierId}`
- **Fonctionnalité**: Permettre le téléchargement des fichiers
- **Headers**: `Content-Disposition: attachment; filename="nom_du_fichier"`

### 3. Gestion des Erreurs
- **Upload**: Retourner des messages d'erreur clairs en cas d'échec
- **Téléchargement**: Gérer les fichiers inexistants
- **Validation**: Vérifier les types de fichiers et la taille

## Implémentation Backend (Spring Boot)

### 1. Entité FichierJoint
```java
@Entity
public class FichierJoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nomFichier;
    private String cheminFichier;
    private String typeMime;
    private Long tailleFichier;
    private LocalDateTime dateUpload;
    
    @ManyToOne
    @JoinColumn(name = "reclamation_id")
    private Reclamation reclamation;
}
```

### 2. Service de Gestion des Fichiers
```java
@Service
public class FichierJointService {
    
    public FichierJoint uploadFichier(MultipartFile file, Long reclamationId) {
        // Logique d'upload
    }
    
    public List<FichierJoint> getFichiersByReclamationId(Long reclamationId) {
        // Récupérer les fichiers d'une réclamation
    }
    
    public Resource downloadFichier(Long fichierId) {
        // Logique de téléchargement
    }
}
```

### 3. Contrôleur
```java
@RestController
@RequestMapping("/api/fichiers")
public class FichierJointController {
    
    @PostMapping("/upload/{reclamationId}")
    public ResponseEntity<FichierJoint> uploadFichier(
        @RequestParam("file") MultipartFile file,
        @PathVariable Long reclamationId
    ) {
        // Logique d'upload
    }
    
    @GetMapping("/download/{fichierId}")
    public ResponseEntity<Resource> downloadFichier(@PathVariable Long fichierId) {
        // Logique de téléchargement
    }
}
```

### 4. Modification du Service de Réclamations
```java
@Service
public class ReclamationService {
    
    public List<ReclamationResponseDTO> getMesReclamations() {
        // Inclure les fichiers joints dans la réponse
        return reclamations.stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());
    }
    
    private ReclamationResponseDTO mapToResponseDTO(Reclamation reclamation) {
        ReclamationResponseDTO dto = new ReclamationResponseDTO();
        // Mapping des champs de base
        dto.setFichiersJoints(fichierJointService.getFichiersByReclamationId(reclamation.getId()));
        return dto;
    }
}
```

## Tests Requis

### 1. Test d'Upload
- Upload d'un fichier PDF
- Upload d'une image
- Upload d'un document Word
- Test avec des fichiers trop volumineux
- Test avec des types de fichiers non autorisés

### 2. Test de Récupération
- Vérifier que les fichiers apparaissent dans la liste des réclamations
- Vérifier que les fichiers peuvent être téléchargés
- Vérifier que les métadonnées sont correctes

### 3. Test de Suppression
- Supprimer une réclamation avec des fichiers joints
- Vérifier que les fichiers sont également supprimés

## Configuration

### 1. Propriétés d'Application
```properties
# Taille maximale des fichiers
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Dossier de stockage des fichiers
app.fichiers.upload-dir=./uploads
```

### 2. Types de Fichiers Autorisés
```java
private static final List<String> ALLOWED_TYPES = Arrays.asList(
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain"
);
```

## Sécurité

### 1. Validation des Fichiers
- Vérifier l'extension et le type MIME
- Scanner les fichiers pour les virus
- Limiter la taille des fichiers

### 2. Accès aux Fichiers
- Seuls les utilisateurs autorisés peuvent télécharger les fichiers
- Vérifier que l'utilisateur a accès à la réclamation

### 3. Stockage Sécurisé
- Stocker les fichiers en dehors du répertoire web
- Utiliser des noms de fichiers uniques
- Chiffrer les fichiers sensibles si nécessaire
