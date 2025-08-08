import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRequest } from 'src/app/models/auth-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  motDePasse = '';
  telephone = '';
  typeUtilisateur: 'DESTINATAIRE' | 'UTILISATEUR' = 'UTILISATEUR';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    if (!this.nom || !this.prenom || !this.email || !this.motDePasse || !this.telephone) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }

    // Définir le rôle selon le type d'utilisateur
    // Pour les destinataires : rôle = UTILISATEUR, type_utilisateur = DESTINATAIRE
    // Pour les utilisateurs : rôle = UTILISATEUR, type_utilisateur = UTILISATEUR
    const role = 'UTILISATEUR'; // Tous les utilisateurs ont le rôle UTILISATEUR
    const type_utilisateur = this.typeUtilisateur; // Le type détermine la table

    const request = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      telephone: this.telephone,
      role: role, // Toujours UTILISATEUR
      type_utilisateur: type_utilisateur, // DESTINATAIRE ou UTILISATEUR
      actif: true
    };

    console.log('Enregistrement avec:', request); // Pour debug

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
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