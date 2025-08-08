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
  unreadNotifications: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    
    // Charger les informations utilisateur
    this.loadUserInfo();
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

  private loadUserInfo(): void {
    // Ici vous pouvez charger les informations utilisateur depuis le service
    // Pour l'instant, on utilise des valeurs par défaut
    this.userName = this.authService.getCurrentUserEmail() || 'Utilisateur';
  }
}
