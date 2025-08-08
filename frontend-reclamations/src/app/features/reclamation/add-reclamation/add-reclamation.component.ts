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
  }

  // Charger toutes les catégories au démarrage
  loadCategories(): void {
    this.service.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.error = 'Erreur lors du chargement des catégories.'
    });
  }

  // Lorsqu'une catégorie est sélectionnée, charger les destinataires associés
  onCategorieChange(): void {
    this.error = '';
    this.destinataires = [];
    this.selectedDestinataireId = null;

    if (!this.selectedCategorieId) return;

    this.service.getDestinatairesByCategorie(this.selectedCategorieId).subscribe({
      next: (dest) => this.destinataires = dest,
      error: () => this.error = 'Erreur lors du chargement des destinataires.'
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
