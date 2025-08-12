import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoiteReceptionService, ReclamationDestinataire, StatistiquesBoiteReception } from '../../core/services/boite-reception.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-boite-reception',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boite-reception.component.html',
  styleUrls: ['./boite-reception.component.css']
})
export class BoiteReceptionComponent implements OnInit {
  private boiteReceptionService = inject(BoiteReceptionService);
  private authService = inject(AuthService);

  reclamations: ReclamationDestinataire[] = [];
  selectedReclamation: ReclamationDestinataire | null = null;
  statistiques: StatistiquesBoiteReception | null = null;
  
  // Filtres et recherche
  searchTerm = '';
  statutFilter = '';
  prioriteFilter = '';
  luFilter = '';
  
  // États
  loading = false;
  error = '';
  
  // Sélection multiple
  selectedReclamations: number[] = [];
  selectAll = false;

  // Type d'utilisateur
  isDestinataire = false;

  ngOnInit(): void {
    this.isDestinataire = this.authService.isDestinataire();
    
    if (this.isDestinataire) {
      this.chargerReclamationsDestinataire();
    } else {
      this.chargerMessages();
    }
    
    this.chargerStatistiques();
  }

  chargerReclamationsDestinataire(): void {
    this.loading = true;
    this.error = '';
    
    this.boiteReceptionService.getReclamationsDestinataire().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        console.log('✅ Réclamations destinataire chargées:', this.reclamations);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des réclamations';
        this.loading = false;
        console.error('Erreur de chargement des réclamations:', err);
      }
    });
  }

  chargerMessages(): void {
    this.loading = true;
    this.error = '';
    
    this.boiteReceptionService.getMessages().subscribe({
      next: (data) => {
        // Convertir les messages en réclamations pour l'affichage
        this.reclamations = data.map(msg => ({
          id: msg.id,
          titre: msg.titre || msg.sujet,
          description: msg.contenu,
          dateCreation: msg.dateEnvoi,
          statut: msg.type,
          priorite: msg.priorite,
          expediteur: msg.expediteur,
          categorie: 'Message',
          lu: msg.lu,
          dateLecture: msg.dateLecture,
          fichierJoint: msg.pieceJointe
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des messages';
        this.loading = false;
        console.error('Erreur de chargement des messages:', err);
      }
    });
  }

  chargerStatistiques(): void {
    this.boiteReceptionService.getStatistiques().subscribe({
      next: (data) => {
        this.statistiques = data;
      },
      error: (err) => {
        console.error('Erreur de chargement des statistiques:', err);
      }
    });
  }

  selectReclamation(reclamation: ReclamationDestinataire): void {
    this.selectedReclamation = reclamation;
    if (!reclamation.lu) {
      this.marquerCommeLue(reclamation.id);
    }
  }

  marquerCommeLue(reclamationId: number): void {
    if (this.isDestinataire) {
      this.boiteReceptionService.marquerReclamationCommeLue(reclamationId).subscribe({
        next: () => {
          const reclamation = this.reclamations.find(r => r.id === reclamationId);
          if (reclamation) {
            reclamation.lu = true;
            reclamation.dateLecture = new Date().toISOString();
          }
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur marquer comme lue:', err);
        }
      });
    } else {
      this.boiteReceptionService.marquerCommeLu(reclamationId).subscribe({
        next: () => {
          const reclamation = this.reclamations.find(r => r.id === reclamationId);
          if (reclamation) {
            reclamation.lu = true;
          }
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur marquer comme lu:', err);
        }
      });
    }
  }

  marquerCommeNonLue(reclamationId: number): void {
    if (this.isDestinataire) {
      // Pour les destinataires, on peut marquer comme non lue
      const reclamation = this.reclamations.find(r => r.id === reclamationId);
      if (reclamation) {
        reclamation.lu = false;
        reclamation.dateLecture = undefined;
      }
    } else {
      this.boiteReceptionService.marquerCommeNonLu(reclamationId).subscribe({
        next: () => {
          const reclamation = this.reclamations.find(r => r.id === reclamationId);
          if (reclamation) {
            reclamation.lu = false;
          }
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur marquer comme non lu:', err);
        }
      });
    }
  }

  toggleSelectReclamation(reclamationId: number): void {
    const index = this.selectedReclamations.indexOf(reclamationId);
    if (index > -1) {
      this.selectedReclamations.splice(index, 1);
    } else {
      this.selectedReclamations.push(reclamationId);
    }
    this.updateSelectAll();
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedReclamations = this.filteredReclamations.map(r => r.id);
    } else {
      this.selectedReclamations = [];
    }
  }

  updateSelectAll(): void {
    this.selectAll = this.selectedReclamations.length === this.filteredReclamations.length;
  }

  marquerPlusieursCommeLues(): void {
    if (this.selectedReclamations.length === 0) return;
    
    this.selectedReclamations.forEach(id => {
      const reclamation = this.reclamations.find(r => r.id === id);
      if (reclamation) {
        reclamation.lu = true;
        reclamation.dateLecture = new Date().toISOString();
      }
    });
    
    this.selectedReclamations = [];
    this.selectAll = false;
    this.chargerStatistiques();
  }

  marquerTousCommeLues(): void {
    this.reclamations.forEach(r => {
      r.lu = true;
      r.dateLecture = new Date().toISOString();
    });
    this.chargerStatistiques();
  }

  rechercherReclamations(): void {
    if (!this.searchTerm.trim()) {
      if (this.isDestinataire) {
        this.chargerReclamationsDestinataire();
      } else {
        this.chargerMessages();
      }
      return;
    }
    
    this.loading = true;
    
    if (this.isDestinataire) {
      this.boiteReceptionService.rechercherReclamations(this.searchTerm).subscribe({
        next: (data) => {
          this.reclamations = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la recherche';
          this.loading = false;
          console.error('Erreur recherche réclamations:', err);
        }
      });
    } else {
      this.boiteReceptionService.rechercherMessages(this.searchTerm).subscribe({
        next: (data) => {
          this.reclamations = data.map(msg => ({
            id: msg.id,
            titre: msg.titre || msg.sujet,
            description: msg.contenu,
            dateCreation: msg.dateEnvoi,
            statut: msg.type,
            priorite: msg.priorite,
            expediteur: msg.expediteur,
            categorie: 'Message',
            lu: msg.lu,
            dateLecture: msg.dateLecture,
            fichierJoint: msg.pieceJointe
          }));
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la recherche';
          this.loading = false;
          console.error('Erreur recherche messages:', err);
        }
      });
    }
  }

  get filteredReclamations(): ReclamationDestinataire[] {
    let filtered = this.reclamations;

    // Filtre par statut
    if (this.statutFilter) {
      filtered = filtered.filter(r => r.statut === this.statutFilter);
    }

    // Filtre par priorité
    if (this.prioriteFilter) {
      filtered = filtered.filter(r => r.priorite === this.prioriteFilter);
    }

    // Filtre par statut lu/non lu
    if (this.luFilter === 'lu') {
      filtered = filtered.filter(r => r.lu);
    } else if (this.luFilter === 'non-lu') {
      filtered = filtered.filter(r => !r.lu);
    }

    return filtered;
  }

  getPrioriteClass(priorite: string): string {
    switch (priorite) {
      case 'URGENTE': return 'priorite-urgente';
      case 'HAUTE': return 'priorite-haute';
      case 'NORMALE': return 'priorite-normale';
      case 'BASSE': return 'priorite-basse';
      default: return '';
    }
  }

  getPrioriteIcon(priorite: string): string {
    switch (priorite) {
      case 'URGENTE': return '🚨';
      case 'HAUTE': return '⚠️';
      case 'NORMALE': return '📧';
      case 'BASSE': return '📮';
      default: return '📧';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'en cours': return 'statut-encours';
      case 'resolu': return 'statut-resolu';
      case 'en attente': return 'statut-attente';
      case 'annule': return 'statut-annule';
      case 'reponse': return 'statut-reponse';
      case 'notification': return 'statut-notification';
      case 'systeme': return 'statut-systeme';
      default: return 'statut-defaut';
    }
  }

  getStatutIcon(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'en cours': return '🔄';
      case 'resolu': return '✅';
      case 'en attente': return '⏳';
      case 'annule': return '❌';
      case 'reponse': return '💬';
      case 'notification': return '🔔';
      case 'systeme': return '⚙️';
      default: return '📋';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statutFilter = '';
    this.prioriteFilter = '';
    this.luFilter = '';
    
    if (this.isDestinataire) {
      this.chargerReclamationsDestinataire();
    } else {
      this.chargerMessages();
    }
  }

  telechargerFichier(reclamation: ReclamationDestinataire): void {
    if (!reclamation.fichierJoint) return;
    
    if (this.isDestinataire) {
      this.boiteReceptionService.telechargerFichierReclamation(reclamation.id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = reclamation.fichierJoint || 'fichier';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erreur téléchargement fichier:', err);
        }
      });
    } else {
      this.boiteReceptionService.telechargerPieceJointe(reclamation.id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = reclamation.fichierJoint || 'piece-jointe';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erreur téléchargement pièce jointe:', err);
        }
      });
    }
  }
}
