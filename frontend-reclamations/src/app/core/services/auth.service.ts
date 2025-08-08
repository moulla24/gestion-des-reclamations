import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/models/auth-request.model';
import { AuthResponse } from 'src/app/models/auth-response.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Import the ProfilUtilisateur interface
export interface ProfilUtilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  type_utilisateur: string;
  actif: boolean;
  dateCreation: string;
  derniereConnexion: string;
  nombreReclamations: number;
  reclamationsResolues: number;
  reclamationsEnCours: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  // Un signal pour suivre l'état de connexion
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor() {}

  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticated.set(true);
        console.log('Connexion réussie, token:', response.token);
      })
    );
  }

  register(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  // Get user profile
  getProfil(): Observable<ProfilUtilisateur> {
    return this.http.get<ProfilUtilisateur>('http://localhost:8080/api/user/profil');
  }



  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === role;
    } catch {
      return false;
    }
  }

  hasType(type: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.type === type;
    } catch {
      return false;
    }
  }

  getCurrentUserEmail(): string | null {
    // Implémentez cette méthode selon votre système d'authentification
    return localStorage.getItem('userEmail');
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isDestinataire(): boolean {
    return this.hasType('DESTINATAIRE');
  }

  isUtilisateur(): boolean {
    return this.hasType('UTILISATEUR');
  }
}
