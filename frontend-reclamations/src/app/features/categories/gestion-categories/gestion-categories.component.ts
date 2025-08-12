import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Categorie } from '../../../models/categorie.model';

@Component({
  selector: 'app-gestion-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-categories.component.html',
  styleUrls: ['./gestion-categories.component.css']
})
export class GestionCategoriesComponent implements OnInit {
  categories: Categorie[] = [];
  newCategorieLibelle = '';
  newCategorieDescription = '';
  editingCategorie: Categorie | null = null;
  error = '';
  success = '';
  loading = false;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.reclamationService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
      }
    });
  }

  addCategorie(): void {
    if (!this.newCategorieLibelle.trim()) {
      this.error = 'Le libellé est requis';
      return;
    }

    this.loading = true;
    const newCategorie = {
      libelle: this.newCategorieLibelle.trim(),
      description: this.newCategorieDescription.trim() || undefined,
      actif: true
    };

    this.reclamationService.ajouterCategorie(newCategorie).subscribe({
      next: () => {
        this.success = 'Catégorie ajoutée avec succès';
        this.newCategorieLibelle = '';
        this.newCategorieDescription = '';
        this.loadCategories();
        this.clearMessages();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de l\'ajout de la catégorie';
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  editCategorie(categorie: Categorie): void {
    this.editingCategorie = { ...categorie };
  }

  updateCategorie(): void {
    if (!this.editingCategorie || !this.editingCategorie.libelle?.trim()) {
      this.error = 'Le libellé est requis';
      return;
    }

    this.loading = true;
    const updatedCategorie = {
      ...this.editingCategorie,
      libelle: this.editingCategorie.libelle.trim(),
      description: this.editingCategorie.description?.trim() || undefined
    };

    this.reclamationService.modifierCategorie(this.editingCategorie.id!, updatedCategorie).subscribe({
      next: () => {
        this.success = 'Catégorie mise à jour avec succès';
        this.editingCategorie = null;
        this.loadCategories();
        this.clearMessages();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de la mise à jour de la catégorie';
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.loading = true;
      this.reclamationService.supprimerCategorie(id).subscribe({
        next: () => {
          this.success = 'Catégorie supprimée avec succès';
          this.loadCategories();
          this.clearMessages();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erreur lors de la suppression de la catégorie';
          this.loading = false;
          this.clearMessages();
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingCategorie = null;
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.error = '';
      this.success = '';
    }, 3000);
  }
}
