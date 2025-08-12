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
    // Envoyer exactement ce que le backend attend
    const requestData = {
      email: request.email,
      motDePasse: request.motDePasse // 'm' minuscule comme attendu par le backend
    };
    
    console.log('🔐 AuthService.login - URL:', `${this.apiUrl}/login`);
    console.log('🔐 AuthService.login - Request data:', requestData);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, requestData).pipe(
      tap(response => {
        console.log('✅ AuthService.login - Response reçue:', response);
        this.setToken(response.token);
        this.isAuthenticated.set(true);
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

  // Récupérer les informations de base depuis le token JWT
  getCurrentUserInfo(): { nom: string; prenom: string; email: string; role: string; type: string } | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        nom: payload.nom || '',
        prenom: payload.prenom || '',
        email: payload.email || payload.sub || '',
        role: payload.role || '',
        type: payload.type || payload.type_utilisateur || ''
      };
    } catch (error) {
      console.error('❌ Erreur lors du décodage du token:', error);
      return null;
    }
  }

  // Récupérer le nom complet de l'utilisateur depuis le token
  getCurrentUserName(): string {
    const userInfo = this.getCurrentUserInfo();
    if (userInfo && userInfo.prenom && userInfo.nom) {
      return `${userInfo.prenom} ${userInfo.nom}`;
    }
    return 'Utilisateur';
  }

  // Récupérer l'email de l'utilisateur depuis le token
  getCurrentUserEmail(): string | null {
    const userInfo = this.getCurrentUserInfo();
    return userInfo?.email || null;
  }

  // Récupérer le rôle de l'utilisateur depuis le token
  getCurrentUserRole(): string {
    const userInfo = this.getCurrentUserInfo();
    if (userInfo?.role) {
      switch (userInfo.role.toUpperCase()) {
        case 'ADMIN': return 'Administrateur';
        case 'UTILISATEUR': return 'Utilisateur';
        case 'DESTINATAIRE': return 'Destinataire';
        default: return 'Utilisateur';
      }
    }
    return 'Utilisateur';
  }

  // Récupérer le type d'utilisateur depuis le token
  getCurrentUserType(): string {
    const userInfo = this.getCurrentUserInfo();
    if (userInfo?.type) {
      switch (userInfo.type.toUpperCase()) {
        case 'DESTINATAIRE': return 'Destinataire';
        case 'UTILISATEUR': return 'Utilisateur';
        default: return 'Utilisateur';
      }
    }
    return 'Utilisateur';
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
}
