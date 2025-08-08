import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;
    
    if (!this.email || !this.motDePasse) {
      this.error = 'Tous les champs sont obligatoires';
      this.loading = false;
      return;
    }

    this.authService.login({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur de connexion:', err);
        if (err.status === 0 || err.status === 404) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else if (err.status === 401) {
          this.error = 'Email ou mot de passe incorrect.';
        } else if (err.status === 500) {
          this.error = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          this.error = err.error?.message || err.message || 'Erreur lors de la connexion';
        }
      }
    });
  }



  goToRegister() {
    this.router.navigate(['/register']);
  }
}
