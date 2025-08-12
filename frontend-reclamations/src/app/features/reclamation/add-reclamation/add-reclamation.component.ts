import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from 'src/app/core/services/reclamation.service';
import { Categorie } from 'src/app/models/categorie.model';
import { Destinataire } from 'src/app/models/destinataire.model';

@Component({
  selector: 'app-add-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css']
})
export class AddReclamationComponent implements OnInit {
  titre = '';
  description = '';
  selectedCategorieId: number | null = null;
  newCategorieLibelle = '';
  selectedDestinataireId: number | null = null;
  newDestinataireNom = '';

  categories: Categorie[] = [];
  destinataires: Destinataire[] = [];

  fileToUpload: File | null = null;
  fileName = '';

  error = '';
  success = '';
  loading = false;

  constructor(private service: ReclamationService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
    // Test temporaire pour diagnostiquer les problèmes d'API
    this.testAPIConnectivity();
    // Test de différentes URLs
    this.testDifferentURLs();
  }

  // Méthode temporaire pour tester la connectivité API
  private testAPIConnectivity(): void {
    console.log('🧪 Test de connectivité API...');
    console.log('URL de base utilisateur:', 'http://localhost:8080/api/user');
    
    // Test direct avec fetch pour vérifier la connectivité
    fetch('http://localhost:8080/api/user/categories')
      .then(response => {
        console.log('✅ Test direct categories - Status:', response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        console.log('✅ Test direct categories - Données reçues:', data);
      })
      .catch(error => {
        console.error('❌ Test direct categories - Erreur:', error);
      });

    // Test des destinataires
    fetch('http://localhost:8080/api/user/destinataires')
      .then(response => {
        console.log('✅ Test direct destinataires - Status:', response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        console.log('✅ Test direct destinataires - Données reçues:', data);
      })
      .catch(error => {
        console.error('❌ Test direct destinataires - Erreur:', error);
      });
  }

  // Charger toutes les catégories depuis la base de données
  loadCategories(): void {
    console.log('🔄 Chargement des catégories depuis la base de données...');
    console.log('🔍 URL utilisée:', 'http://localhost:8080/api/user/categories');
    this.loading = true;
    this.error = '';
    
    // Test avec différentes approches
    console.log('🧪 Test 1: Via le service Angular');
    this.service.getCategories().subscribe({
      next: (cats) => {
        console.log('✅ Catégories reçues via service Angular:', cats);
        console.log('🔍 Type de données:', typeof cats);
        console.log('🔍 Est-ce un array?', Array.isArray(cats));
        console.log('🔍 Structure de la première catégorie:', cats[0]);
        
        this.categories = cats;
        this.loading = false;
        console.log(`✅ Nombre de catégories chargées: ${cats.length}`);
        
        if (cats.length === 0) {
          this.error = 'Aucune catégorie disponible. Veuillez contacter l\'administrateur.';
          console.log('⚠️ Aucune catégorie trouvée');
        } else {
          console.log('✅ Catégories chargées avec succès');
          // Afficher chaque catégorie pour debug
          cats.forEach((cat, index) => {
            console.log(`📋 Catégorie ${index + 1}:`, cat);
          });
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des catégories via service Angular:', err);
        this.error = 'Impossible de charger les catégories depuis la base de données. Vérifiez votre connexion.';
        this.loading = false;
        this.categories = [];
        
        // Test alternatif avec fetch
        console.log('🧪 Test 2: Via fetch direct');
        this.testFetchCategories();
      }
    });
  }

  // Test alternatif avec fetch
  private testFetchCategories(): void {
    fetch('http://localhost:8080/api/user/categories')
      .then(response => {
        console.log('🔍 Fetch - Status:', response.status);
        console.log('🔍 Fetch - Headers:', response.headers);
        return response.json();
      })
      .then(data => {
        console.log('✅ Fetch - Données reçues:', data);
        this.categories = data;
        this.loading = false;
      })
      .catch(error => {
        console.error('❌ Fetch - Erreur:', error);
        this.loading = false;
      });
  }

  // Test avec différentes URLs pour diagnostiquer le problème
  private testDifferentURLs(): void {
    console.log('🧪 Test de différentes URLs...');
    
    const urlsToTest = [
      'http://localhost:8080/api/user/categories',
      'http://localhost:8080/api/categories',
      'http://localhost:8080/api/user/admin/categories',
      'http://localhost:8080/api/reclamations/categories'
    ];
    
    urlsToTest.forEach(url => {
      console.log(`🔍 Test de l'URL: ${url}`);
      fetch(url)
        .then(response => {
          console.log(`✅ ${url} - Status: ${response.status}`);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        })
        .then(data => {
          console.log(`✅ ${url} - Données:`, data);
        })
        .catch(error => {
          console.log(`❌ ${url} - Erreur:`, error.message);
        });
    });
  }

  // Lorsqu'une catégorie est sélectionnée, charger les destinataires associés depuis la base de données
  onCategorieChange(): void {
    this.error = '';
    this.destinataires = [];
    this.selectedDestinataireId = null;

    if (!this.selectedCategorieId) {
      console.log('Aucune catégorie sélectionnée');
      return;
    }

    console.log('🔄 Chargement des destinataires depuis la base de données pour la catégorie:', this.selectedCategorieId);
    this.loading = true;
    
    this.service.getDestinatairesByCategorie(this.selectedCategorieId).subscribe({
      next: (dest) => {
        console.log('✅ Destinataires reçus depuis la base de données:', dest);
        this.destinataires = dest;
        this.loading = false;
        
        if (dest.length === 0) {
          console.log('⚠️ Aucun destinataire trouvé pour cette catégorie');
          this.error = 'Aucun destinataire disponible pour cette catégorie. Veuillez contacter l\'administrateur.';
        } else {
          console.log(`✅ ${dest.length} destinataire(s) trouvé(s) pour la catégorie ${this.selectedCategorieId}`);
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des destinataires depuis la base de données:', err);
        this.error = 'Impossible de charger les destinataires depuis la base de données. Vérifiez votre connexion.';
        this.loading = false;
        this.destinataires = []; // Pas de fallback, on veut les vraies données
      }
    });
  }

  // Gestion de la sélection de fichier
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.error = 'Le fichier est trop volumineux. Taille maximale : 10MB';
        input.value = '';
        this.fileToUpload = null;
        this.fileName = '';
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.error = 'Type de fichier non autorisé. Types acceptés : PDF, images, documents Word/Excel, texte';
        input.value = '';
        this.fileToUpload = null;
        this.fileName = '';
        return;
      }

      this.fileToUpload = file;
      this.fileName = file.name;
      this.error = '';
    }
  }

  // Clear file selection
  clearFile(): void {
    this.fileToUpload = null;
    this.fileName = '';
    const fileInput = document.getElementById('fichierJoint') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Clear messages after timeout
  private clearMessages(): void {
    setTimeout(() => {
      this.success = '';
      this.error = '';
    }, 5000);
  }

  // Soumettre la réclamation
  soumettre(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    // Validation des champs obligatoires
    if (!this.titre || !this.description) {
      this.error = 'Veuillez remplir le titre et la description.';
      this.loading = false;
      this.clearMessages();
      return;
    }

    if (!this.selectedCategorieId && !this.newCategorieLibelle) {
      this.error = 'Veuillez sélectionner ou créer une catégorie.';
      this.loading = false;
      this.clearMessages();
      return;
    }

    if (!this.selectedDestinataireId && !this.newDestinataireNom) {
      this.error = 'Veuillez sélectionner ou créer un destinataire.';
      this.loading = false;
      this.clearMessages();
      return;
    }

    // Préparer l'objet réclamation
    const reclamation: any = {
      titre: this.titre,
      description: this.description,
      categorieId: 0,
      destinataireId: 0
    };

    // Après création du destinataire, soumettre la réclamation
    const soumettreReclamation = () => {
      this.service.soumettreReclamation(reclamation).subscribe({
        next: (createdReclamation: any) => {
          console.log('Réclamation créée:', createdReclamation);
          
          // Si fichier joint, upload avec l'ID de la réclamation
          if (this.fileToUpload && createdReclamation.id) {
            console.log('Upload du fichier:', this.fileToUpload.name);
            this.service.uploadFichier(this.fileToUpload, createdReclamation.id).subscribe({
              next: (uploadResult: any) => {
                console.log('Fichier uploadé avec succès:', uploadResult);
                this.success = 'Réclamation et fichier soumis avec succès !';
                this.loading = false;
                setTimeout(() => this.router.navigate(['/dashboard/reclamations']), 3000);
              },
              error: (err: any) => {
                console.error('Erreur upload fichier:', err);
                // Même si l'upload échoue, la réclamation a été créée
                this.success = 'Réclamation soumise avec succès ! (Erreur lors de l\'upload du fichier)';
                this.loading = false;
                setTimeout(() => this.router.navigate(['/dashboard/reclamations']), 3000);
              }
            });
          } else {
            this.success = 'Réclamation soumise avec succès !';
            this.loading = false;
            setTimeout(() => this.router.navigate(['/dashboard/reclamations']), 3000);
          }
        },
        error: (err: any) => {
          console.error('Erreur création réclamation:', err);
          this.error = err?.error?.message || 'Erreur lors de la soumission de la réclamation.';
          this.loading = false;
          this.clearMessages();
        }
      });
    };

    // Étape : Création ou sélection de la catégorie
    const traiterCategorie = () => {
      if (this.newCategorieLibelle) {
        this.service.ajouterCategorie({ libelle: this.newCategorieLibelle }).subscribe({
          next: (c: any) => {
            reclamation.categorieId = c.id!;
            traiterDestinataire();
          },
          error: (err: any) => {
            console.error('Erreur création catégorie:', err);
            this.error = err?.error?.message || 'Erreur lors de la création de la catégorie.';
            this.loading = false;
            this.clearMessages();
          }
        });
      } else {
        reclamation.categorieId = this.selectedCategorieId!;
        traiterDestinataire();
      }
    };

    // Étape : Création ou sélection du destinataire
    const traiterDestinataire = () => {
      if (this.newDestinataireNom) {
        const d: Destinataire = {
          nom: this.newDestinataireNom,
          prenom: '',
          email: '',
          service: '',
          role: 'UTILISATEUR',
          type_utilisateur: 'DESTINATAIRE',
          categorie: { id: reclamation.categorieId, libelle: '' }  // associer la bonne catégorie
        };
        this.service.ajouterDestinataire(d).subscribe({
          next: (dest: any) => {
            reclamation.destinataireId = dest.id!;
            soumettreReclamation();
          },
          error: (err: any) => {
            console.error('Erreur création destinataire:', err);
            this.error = err?.error?.message || 'Erreur lors de la création du destinataire.';
            this.loading = false;
            this.clearMessages();
          }
        });
      } else {
        reclamation.destinataireId = this.selectedDestinataireId!;
        soumettreReclamation();
      }
    };

    // Lancer le processus
    traiterCategorie();
  }
}
