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
  testingConnection = false;
  connectionStatus = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;
    
    if (!this.email || !this.motDePasse) {
      this.error = 'Tous les champs sont obligatoires';
      this.loading = false;
      return;
    }

    const loginData = { email: this.email, motDePasse: this.motDePasse };
    console.log('🔑 LoginComponent - Données envoyées:', loginData);

    this.authService.login(loginData).subscribe({
      next: () => {
        this.loading = false;
        console.log('✅ LoginComponent - Connexion réussie');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ LoginComponent - Erreur complète:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ StatusText:', err.statusText);
        console.error('❌ Error object:', err.error);
        console.error('❌ Message:', err.message);
        
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

  testConnection() {
    this.testingConnection = true;
    this.connectionStatus = 'Test de connexion en cours...';
    
    // Test simple avec fetch pour vérifier la connectivité
    fetch('http://localhost:8080/api/auth/ping')
      .then(response => {
        if (response.ok) {
          this.connectionStatus = '✅ Serveur accessible';
        } else {
          this.connectionStatus = `❌ Serveur répond avec status: ${response.status}`;
        }
      })
      .catch(error => {
        console.error('Erreur de test de connexion:', error);
        this.connectionStatus = '❌ Serveur inaccessible. Vérifiez que le backend est démarré sur http://localhost:8080';
      })
      .finally(() => {
        this.testingConnection = false;
        setTimeout(() => this.connectionStatus = '', 5000);
      });
  }
}
