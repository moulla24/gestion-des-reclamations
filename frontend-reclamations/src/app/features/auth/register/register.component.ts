// src/app/features/auth/register/register.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategorieService } from '../../../core/services/CategorieService';
import { Categorie } from '../../../models/categorie.model';
import { AuthRequest } from 'src/app/models/auth-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  nom = '';
  prenom = '';
  email = '';
  motDePasse = '';
  telephone = '';
  typeUtilisateur: 'DESTINATAIRE' | 'UTILISATEUR' = 'UTILISATEUR';
  service = '';
  categorieId: number | undefined = undefined;
  error = '';

  categories: Categorie[] = [];
  loadingCategories = false;

  private authService = inject(AuthService);
  private categorieService = inject(CategorieService);
  private router = inject(Router);

  ngOnInit(): void {
    // Optionnel: charger d’emblée. Sinon, ne charge que si on choisit DESTINATAIRE.
    // this.loadCategories();
  }

  onTypeChange() {
    if (this.typeUtilisateur === 'DESTINATAIRE' && this.categories.length === 0) {
      this.loadCategories();
    }
  }

  private loadCategories() {
    this.loadingCategories = true;
    this.categorieService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: (err) => {
        this.loadingCategories = false;
        this.error = err?.error?.message || 'Impossible de charger les catégories';
        console.error('Erreur chargement catégories:', err);
      }
    });
  }

  register() {
    this.error = '';
    if (!this.nom || !this.prenom || !this.email || !this.motDePasse || !this.telephone) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }

    if (this.typeUtilisateur === 'DESTINATAIRE') {
      if (!this.service || !this.categorieId) {
        this.error = 'Service et catégorie sont obligatoires pour les destinataires';
        return;
      }
    }

    const request: AuthRequest = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse, // correspond au backend
      telephone: this.telephone,
      role: this.typeUtilisateur,  // "DESTINATAIRE" ou "UTILISATEUR"
      actif: true,
      service: this.typeUtilisateur === 'DESTINATAIRE' ? this.service : undefined,
      categorieId: this.typeUtilisateur === 'DESTINATAIRE' ? this.categorieId : undefined
    };

    this.authService.register(request).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de l\'inscription';
        console.error('Erreur d\'inscription:', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
