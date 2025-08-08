import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService, ProfilUtilisateur, StatistiquesUtilisateur } from '../../../core/services/utilisateur.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);
  private authService = inject(AuthService);

  profil: ProfilUtilisateur | null = null;
  statistiques: StatistiquesUtilisateur | null = null;
  historiqueConnexions: any[] = [];
  notifications: any[] = [];
  
  // Mode d'édition
  modeEdition = false;
  modeChangementMotDePasse = false;
  
  // Formulaires
  profilForm = {
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  };
  
  motDePasseForm = {
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  };
  
  // États
  loading = false;
  error = '';
  success = '';
  
  // Onglets
  ongletActif = 'profil';

  ngOnInit(): void {
    this.chargerProfil();
    this.chargerStatistiques();
    this.chargerHistoriqueConnexions();
    this.chargerNotifications();
  }

  chargerProfil(): void {
    this.loading = true;
    this.utilisateurService.getProfil().subscribe({
      next: (data: ProfilUtilisateur) => {
        this.profil = data;
        this.profilForm = {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone
        };
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        console.error('Erreur profil:', err);
      }
    });
  }

  chargerStatistiques(): void {
    this.utilisateurService.getStatistiques().subscribe({
      next: (data: StatistiquesUtilisateur) => {
        this.statistiques = data;
      },
      error: (err: any) => {
        console.error('Erreur statistiques:', err);
      }
    });
  }

  chargerHistoriqueConnexions(): void {
    this.utilisateurService.getHistoriqueConnexions().subscribe({
      next: (data: any[]) => {
        this.historiqueConnexions = data;
      },
      error: (err: any) => {
        console.error('Erreur historique connexions:', err);
      }
    });
  }

  chargerNotifications(): void {
    this.utilisateurService.getNotifications().subscribe({
      next: (data: any[]) => {
        this.notifications = data;
      },
      error: (err: any) => {
        console.error('Erreur notifications:', err);
      }
    });
  }

  activerModeEdition(): void {
    this.modeEdition = true;
    this.error = '';
    this.success = '';
  }

  annulerEdition(): void {
    this.modeEdition = false;
    if (this.profil) {
      this.profilForm = {
        nom: this.profil.nom,
        prenom: this.profil.prenom,
        email: this.profil.email,
        telephone: this.profil.telephone
      };
    }
  }

  sauvegarderProfil(): void {
    if (!this.profil) return;
    
    this.loading = true;
    this.utilisateurService.updateProfil(this.profilForm).subscribe({
      next: (data: ProfilUtilisateur) => {
        this.profil = data;
        this.modeEdition = false;
        this.success = 'Profil mis à jour avec succès';
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors de la mise à jour du profil';
        this.loading = false;
      }
    });
  }

  activerChangementMotDePasse(): void {
    this.modeChangementMotDePasse = true;
    this.motDePasseForm = {
      ancienMotDePasse: '',
      nouveauMotDePasse: '',
      confirmerMotDePasse: ''
    };
    this.error = '';
    this.success = '';
  }

  annulerChangementMotDePasse(): void {
    this.modeChangementMotDePasse = false;
  }

  changerMotDePasse(): void {
    if (this.motDePasseForm.nouveauMotDePasse !== this.motDePasseForm.confirmerMotDePasse) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.motDePasseForm.nouveauMotDePasse.length < 6) {
      this.error = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.utilisateurService.changerMotDePasse(
      this.motDePasseForm.ancienMotDePasse,
      this.motDePasseForm.nouveauMotDePasse
    ).subscribe({
      next: () => {
        this.modeChangementMotDePasse = false;
        this.success = 'Mot de passe changé avec succès';
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors du changement de mot de passe';
        this.loading = false;
      }
    });
  }

  marquerNotificationLue(notificationId: number): void {
    this.utilisateurService.marquerNotificationLue(notificationId).subscribe({
      next: () => {
        this.chargerNotifications();
      },
      error: (err: any) => {
        console.error('Erreur marquer notification lue:', err);
      }
    });
  }

  supprimerNotification(notificationId: number): void {
    this.utilisateurService.supprimerNotification(notificationId).subscribe({
      next: () => {
        this.chargerNotifications();
      },
      error: (err: any) => {
        console.error('Erreur supprimer notification:', err);
      }
    });
  }

  desactiverCompte(): void {
    if (confirm('Êtes-vous sûr de vouloir désactiver votre compte ? Cette action est irréversible.')) {
      this.utilisateurService.desactiverCompte().subscribe({
        next: () => {
          this.authService.logout();
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Erreur lors de la désactivation du compte';
        }
      });
    }
  }

  changerOnglet(onglet: string): void {
    this.ongletActif = onglet;
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'UTILISATEUR': return 'Utilisateur';
      default: return role;
    }
  }

  getTypeUtilisateurLabel(type: string): string {
    switch (type) {
      case 'DESTINATAIRE': return 'Destinataire';
      case 'UTILISATEUR': return 'Utilisateur standard';
      default: return type;
    }
  }

  getStatutCompteLabel(actif: boolean): string {
    return actif ? 'Actif' : 'Inactif';
  }

  getStatutCompteClass(actif: boolean): string {
    return actif ? 'statut-actif' : 'statut-inactif';
  }
}
