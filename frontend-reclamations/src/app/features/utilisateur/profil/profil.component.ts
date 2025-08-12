import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ProfilUtilisateur, StatistiquesUtilisateur } from '../../../core/services/utilisateur.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profil: ProfilUtilisateur | null = null;
  statistiques: StatistiquesUtilisateur | null = null;
  loading = false;
  error = '';
  success = '';

  // Mode édition
  isEditing = false;
  editForm = {
    nom: '',
    prenom: '',
    telephone: ''
  };

  // Changement de mot de passe
  changePassword = {
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  };

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    // Charger d'abord les informations de base depuis le token JWT
    this.chargerProfilFromToken();
    // Puis charger le profil complet depuis l'API
    this.chargerProfilFromAPI();
    this.chargerStatistiques();
  }

  private chargerProfilFromToken(): void {
    // Récupérer les informations de base depuis le token JWT
    const userInfo = this.authService.getCurrentUserInfo();
    
    if (userInfo) {
      console.log('✅ Informations utilisateur récupérées depuis le token:', userInfo);
      
      // Créer un profil de base avec les informations du token
      this.profil = {
        id: 0, // Sera mis à jour par l'API
        nom: userInfo.nom || '',
        prenom: userInfo.prenom || '',
        email: userInfo.email || '',
        telephone: '',
        role: userInfo.role || '',
        type_utilisateur: userInfo.type || '',
        actif: true,
        dateCreation: new Date().toISOString(),
        derniereConnexion: new Date().toISOString(),
        nombreReclamations: 0,
        reclamationsResolues: 0,
        reclamationsEnCours: 0
      };
      
      // Mettre à jour le formulaire d'édition
      this.editForm = {
        nom: this.profil.nom,
        prenom: this.profil.prenom,
        telephone: this.profil.telephone
      };
      
      console.log('👤 Profil de base créé depuis le token:', this.profil);
    } else {
      console.warn('⚠️ Aucune information utilisateur trouvée dans le token');
      this.error = 'Impossible de récupérer les informations utilisateur';
    }
  }

  private chargerProfilFromAPI(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.getProfil().subscribe({
      next: (data: any) => {
        console.log('✅ Profil utilisateur chargé depuis l\'API:', data);
        
        // Mettre à jour le profil avec les données de l'API
        if (this.profil) {
          this.profil = {
            ...this.profil,
            ...data,
            // Garder les informations du token si l'API ne les fournit pas
            nom: data.nom || this.profil.nom,
            prenom: data.prenom || this.profil.prenom,
            email: data.email || this.profil.email,
            role: data.role || this.profil.role,
            type_utilisateur: data.type_utilisateur || this.profil.type_utilisateur
          };
        } else {
          this.profil = data;
        }
        
        // Mettre à jour le formulaire d'édition
        this.editForm = {
          nom: this.profil?.nom || '',
          prenom: this.profil?.prenom || '',
          telephone: this.profil?.telephone || ''
        };
        
        this.loading = false;
        console.log('👤 Profil final mis à jour:', this.profil);
      },
      error: (err: any) => {
        console.error('❌ Erreur lors du chargement du profil API:', err);
        this.error = 'Erreur lors du chargement du profil depuis l\'API';
        this.loading = false;
        
        // Si l'API échoue, on garde les informations du token
        console.log('💡 Utilisation des informations du token JWT');
      }
    });
  }

  chargerProfil(): void {
    // Cette méthode est maintenant remplacée par chargerProfilFromToken et chargerProfilFromAPI
    console.log('🔄 Méthode chargerProfil() appelée - redirection vers les nouvelles méthodes');
    this.chargerProfilFromToken();
    this.chargerProfilFromAPI();
  }

  chargerStatistiques(): void {
    this.utilisateurService.getStatistiques().subscribe({
      next: (data: StatistiquesUtilisateur) => {
        this.statistiques = data;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques:', err);
      }
    });
  }

  activerEdition(): void {
    this.isEditing = true;
    this.error = '';
    this.success = '';
  }

  annulerEdition(): void {
    this.isEditing = false;
    this.editForm = {
      nom: this.profil?.nom || '',
      prenom: this.profil?.prenom || '',
      telephone: this.profil?.telephone || ''
    };
    this.error = '';
  }

  sauvegarderProfil(): void {
    if (!this.profil) return;

    this.loading = true;
    this.utilisateurService.mettreAJourProfil({
      nom: this.editForm.nom,
      prenom: this.editForm.prenom,
      telephone: this.editForm.telephone
    }).subscribe({
      next: (data: ProfilUtilisateur) => {
        this.profil = data;
        this.isEditing = false;
        this.success = 'Profil mis à jour avec succès';
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour du profil:', err);
        this.error = err.error?.message || 'Erreur lors de la mise à jour du profil';
        this.loading = false;
      }
    });
  }

  changerMotDePasse(): void {
    if (this.changePassword.nouveauMotDePasse !== this.changePassword.confirmerMotDePasse) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.changePassword.nouveauMotDePasse.length < 6) {
      this.error = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.utilisateurService.changerMotDePasse(
      this.changePassword.ancienMotDePasse,
      this.changePassword.nouveauMotDePasse
    ).subscribe({
      next: () => {
        this.success = 'Mot de passe changé avec succès';
        this.changePassword = {
          ancienMotDePasse: '',
          nouveauMotDePasse: '',
          confirmerMotDePasse: ''
        };
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        console.error('Erreur lors du changement de mot de passe:', err);
        this.error = err.error?.message || 'Erreur lors du changement de mot de passe';
        this.loading = false;
      }
    });
  }

  desactiverCompte(): void {
    if (confirm('Êtes-vous sûr de vouloir désactiver votre compte ? Cette action est irréversible.')) {
      this.loading = true;
      this.utilisateurService.desactiverCompte().subscribe({
        next: () => {
          this.authService.logout();
        },
        error: (err: any) => {
          console.error('Erreur lors de la désactivation du compte:', err);
          this.error = 'Erreur lors de la désactivation du compte';
          this.loading = false;
        }
      });
    }
  }

  getRoleDisplay(): string {
    if (!this.profil) return '';
    
    switch (this.profil.role) {
      case 'ADMIN': return 'Administrateur';
      case 'DESTINATAIRE': return 'Destinataire';
      case 'UTILISATEUR': return 'Utilisateur';
      default: return this.profil.role;
    }
  }

  getStatusDisplay(): string {
    if (!this.profil) return '';
    return this.profil.actif ? 'Actif' : 'Inactif';
  }

  getStatusClass(): string {
    if (!this.profil) return '';
    return this.profil.actif ? 'status-active' : 'status-inactive';
  }
}
