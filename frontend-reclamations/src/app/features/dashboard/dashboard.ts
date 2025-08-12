import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class Dashboard implements OnInit {

  isAdmin: boolean = false;
  isDestinataire: boolean = false;
  currentPage: string = 'Accueil';
  userRole: string = 'Utilisateur';
  userName: string = 'Utilisateur';
  userEmail: string = 'utilisateur@example.com';
  unreadNotifications: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les informations utilisateur depuis le token JWT
    this.loadUserInfoFromToken();
    
    // Récupérer rôle depuis le token ou service Auth
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.isDestinataire = this.authService.hasType('DESTINATAIRE');
    
    if (this.isAdmin) {
      this.userRole = 'Administrateur';
    } else if (this.isDestinataire) {
      this.userRole = 'Destinataire';
    } else {
      this.userRole = 'Utilisateur';
    }
    
    // Écouter les changements de route pour mettre à jour le breadcrumb
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentPage(event.url);
    });
    
    // Charger les informations détaillées du profil depuis l'API
    this.loadUserProfileFromAPI();
  }

  private updateCurrentPage(url: string): void {
    if (url.includes('nouvelle-reclamation')) {
      this.currentPage = 'Nouvelle Réclamation';
    } else if (url.includes('reclamations')) {
      this.currentPage = 'Liste des Réclamations';
    } else if (url.includes('historique')) {
      this.currentPage = 'Historique';
    } else if (url.includes('boite-reception')) {
      this.currentPage = 'Boîte de Réception';
    } else if (url.includes('profil')) {
      this.currentPage = 'Profil';
    } else if (url.includes('gestion-categories')) {
      this.currentPage = 'Gestion des Catégories';
    } else if (url.includes('gestion-destinataires')) {
      this.currentPage = 'Gestion des Destinataires';
    } else if (url.includes('gestion-reclamations')) {
      this.currentPage = 'Gestion des Réclamations';
    } else {
      this.currentPage = 'Accueil';
    }
  }

  private loadUserInfoFromToken(): void {
    // Récupérer les informations de base depuis le token JWT
    const userInfo = this.authService.getCurrentUserInfo();
    
    if (userInfo) {
      console.log('✅ Informations utilisateur récupérées depuis le token:', userInfo);
      
      // Afficher le nom complet
      if (userInfo.prenom && userInfo.nom) {
        this.userName = `${userInfo.prenom} ${userInfo.nom}`;
        console.log('👤 Nom d\'utilisateur affiché (token):', this.userName);
      }
      
      // Afficher l'email
      if (userInfo.email) {
        this.userEmail = userInfo.email;
        console.log('📧 Email utilisateur affiché (token):', this.userEmail);
      }
      
      // Afficher le rôle
      this.userRole = this.authService.getCurrentUserRole();
      console.log('🔑 Rôle utilisateur affiché (token):', this.userRole);
    } else {
      console.warn('⚠️ Aucune information utilisateur trouvée dans le token');
      this.userName = 'Utilisateur';
      this.userEmail = 'utilisateur@example.com';
      this.userRole = 'Utilisateur';
    }
  }

  private loadUserProfileFromAPI(): void {
    // Charger le profil complet depuis l'API pour des informations détaillées
    this.authService.getProfil().subscribe({
      next: (profil) => {
        console.log('✅ Profil utilisateur chargé depuis l\'API:', profil);
        
        // Mettre à jour avec les informations de l'API si elles sont plus complètes
        if (profil.prenom && profil.nom) {
          this.userName = `${profil.prenom} ${profil.nom}`;
          console.log('👤 Nom d\'utilisateur mis à jour (API):', this.userName);
        }
        
        if (profil.role) {
          this.userRole = this.authService.getCurrentUserRole();
          console.log('🔑 Rôle utilisateur mis à jour (API):', this.userRole);
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du profil API:', err);
        // Les informations du token restent affichées
        console.log('💡 Utilisation des informations du token JWT');
      }
    });
  }
}
