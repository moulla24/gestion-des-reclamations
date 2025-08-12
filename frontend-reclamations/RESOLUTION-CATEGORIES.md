# Résolution du Problème de Chargement des Catégories

## Problème identifié
Le composant d'ajout de réclamation n'arrive pas à charger les catégories depuis la base de données et affiche seulement "Problème technique" au lieu des vraies catégories.

## Diagnostic

### 1. Vérification des endpoints API
Le composant utilise les endpoints suivants :
- **Catégories** : `GET http://localhost:8080/api/user/categories`
- **Destinataires par catégorie** : `GET http://localhost:8080/api/user/destinataires/by-categorie/{id}`

### 2. Tests de connectivité
Le composant inclut maintenant des tests de connectivité qui s'exécutent au démarrage et affichent dans la console :
- Le statut HTTP des réponses
- Les données reçues ou les erreurs
- La connectivité générale avec le backend

## Solutions possibles

### Solution 1 : Vérifier que le backend est démarré
```bash
# Vérifier que le serveur backend est accessible
curl http://localhost:8080/api/user/categories
```

### Solution 2 : Vérifier les endpoints dans le backend
Le backend doit avoir les endpoints suivants :
```java
@GetMapping("/api/user/categories")
public List<Categorie> getCategories() { ... }

@GetMapping("/api/user/destinataires/by-categorie/{categorieId}")
public List<Destinataire> getDestinatairesByCategorie(@PathVariable Long categorieId) { ... }
```

### Solution 3 : Vérifier l'authentification
Si les endpoints nécessitent une authentification :
- Vérifier que l'utilisateur est connecté
- Vérifier que le token JWT est valide
- Vérifier que l'intercepteur d'authentification fonctionne

### Solution 4 : Vérifier la structure des données
Le modèle `Categorie` doit avoir la structure suivante :
```typescript
interface Categorie {
  id?: number;
  libelle: string;        // ⚠️ Important : 'libelle' et non 'nom'
  description?: string;
  actif?: boolean;
}
```

## Comment tester

1. **Ouvrir la console du navigateur** (F12)
2. **Naviguer vers** `/dashboard/reclamations/add`
3. **Vérifier les logs** :
   ```
   🧪 Test de connectivité API...
   ✅ Test direct categories - Status: 200
   ✅ Test direct categories - Données reçues: [...]
   ```

## Résolution recommandée

### Étape 1 : Vérifier le backend
- S'assurer que le serveur backend est démarré sur le port 8080
- Vérifier que les endpoints `/api/user/categories` et `/api/user/destinataires/*` existent
- Tester les endpoints directement avec Postman ou curl

### Étape 2 : Vérifier l'authentification
- S'assurer que l'utilisateur est connecté avant d'accéder au composant
- Vérifier que le token JWT est correctement envoyé dans les headers

### Étape 3 : Vérifier la structure des données
- S'assurer que le modèle `Categorie` correspond à la structure du backend
- Vérifier que le champ `libelle` est bien utilisé (et non `nom`)

### Étape 4 : Nettoyer le composant
Une fois le problème résolu, supprimer la méthode `testAPIConnectivity()` du composant.

## Logs de débogage

Le composant affiche maintenant des logs détaillés dans la console :
- 🔄 Chargement des catégories depuis la base de données...
- ✅ Catégories reçues depuis la base de données: [...]
- ❌ Erreur lors du chargement des catégories depuis la base de données: ...

## Fichiers à vérifier

1. **Backend** : Contrôleurs et services pour les catégories et destinataires
2. **Frontend** : `ReclamationService` et ses URLs
3. **Modèles** : Structure des interfaces `Categorie` et `Destinataire`
4. **Authentification** : Intercepteur et gestion des tokens JWT
