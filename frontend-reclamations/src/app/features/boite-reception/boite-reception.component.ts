import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoiteReceptionService, MessageReception, StatistiquesBoiteReception } from '../../core/services/boite-reception.service';

@Component({
  selector: 'app-boite-reception',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boite-reception.component.html',
  styleUrls: ['./boite-reception.component.css']
})
export class BoiteReceptionComponent implements OnInit {
  private boiteReceptionService = inject(BoiteReceptionService);

  messages: MessageReception[] = [];
  selectedMessage: MessageReception | null = null;
  statistiques: StatistiquesBoiteReception | null = null;
  
  // Filtres et recherche
  searchTerm = '';
  typeFilter = '';
  prioriteFilter = '';
  luFilter = '';
  
  // États
  loading = false;
  error = '';
  
  // Sélection multiple
  selectedMessages: number[] = [];
  selectAll = false;

  ngOnInit(): void {
    this.chargerMessages();
    this.chargerStatistiques();
  }

  chargerMessages(): void {
    this.loading = true;
    this.error = '';
    
    this.boiteReceptionService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
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

  selectMessage(message: MessageReception): void {
    this.selectedMessage = message;
    if (!message.lu) {
      this.marquerCommeLu(message.id);
    }
  }

  marquerCommeLu(messageId: number): void {
    this.boiteReceptionService.marquerCommeLu(messageId).subscribe({
      next: () => {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
          message.lu = true;
        }
        this.chargerStatistiques();
      },
      error: (err) => {
        console.error('Erreur marquer comme lu:', err);
      }
    });
  }

  marquerCommeNonLu(messageId: number): void {
    this.boiteReceptionService.marquerCommeNonLu(messageId).subscribe({
      next: () => {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
          message.lu = false;
        }
        this.chargerStatistiques();
      },
      error: (err) => {
        console.error('Erreur marquer comme non lu:', err);
      }
    });
  }

  supprimerMessage(messageId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      this.boiteReceptionService.supprimerMessage(messageId).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== messageId);
          if (this.selectedMessage?.id === messageId) {
            this.selectedMessage = null;
          }
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur suppression message:', err);
        }
      });
    }
  }

  toggleSelectMessage(messageId: number): void {
    const index = this.selectedMessages.indexOf(messageId);
    if (index > -1) {
      this.selectedMessages.splice(index, 1);
    } else {
      this.selectedMessages.push(messageId);
    }
    this.updateSelectAll();
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedMessages = this.filteredMessages.map(m => m.id);
    } else {
      this.selectedMessages = [];
    }
  }

  updateSelectAll(): void {
    this.selectAll = this.selectedMessages.length === this.filteredMessages.length;
  }

  marquerPlusieursCommeLus(): void {
    if (this.selectedMessages.length === 0) return;
    
    this.boiteReceptionService.marquerPlusieursCommeLus(this.selectedMessages).subscribe({
      next: () => {
        this.messages.forEach(m => {
          if (this.selectedMessages.includes(m.id)) {
            m.lu = true;
          }
        });
        this.selectedMessages = [];
        this.selectAll = false;
        this.chargerStatistiques();
      },
      error: (err) => {
        console.error('Erreur marquer plusieurs comme lus:', err);
      }
    });
  }

  supprimerPlusieursMessages(): void {
    if (this.selectedMessages.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.selectedMessages.length} message(s) ?`)) {
      this.boiteReceptionService.supprimerPlusieursMessages(this.selectedMessages).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => !this.selectedMessages.includes(m.id));
          if (this.selectedMessage && this.selectedMessages.includes(this.selectedMessage.id)) {
            this.selectedMessage = null;
          }
          this.selectedMessages = [];
          this.selectAll = false;
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur suppression plusieurs messages:', err);
        }
      });
    }
  }

  marquerTousCommeLus(): void {
    this.boiteReceptionService.marquerTousCommeLus().subscribe({
      next: () => {
        this.messages.forEach(m => m.lu = true);
        this.chargerStatistiques();
      },
      error: (err) => {
        console.error('Erreur marquer tous comme lus:', err);
      }
    });
  }

  viderBoiteReception(): void {
    if (confirm('Êtes-vous sûr de vouloir vider complètement la boîte de réception ? Cette action est irréversible.')) {
      this.boiteReceptionService.viderBoiteReception().subscribe({
        next: () => {
          this.messages = [];
          this.selectedMessage = null;
          this.selectedMessages = [];
          this.selectAll = false;
          this.chargerStatistiques();
        },
        error: (err) => {
          console.error('Erreur vider boîte réception:', err);
        }
      });
    }
  }

  rechercherMessages(): void {
    if (!this.searchTerm.trim()) {
      this.chargerMessages();
      return;
    }
    
    this.loading = true;
    this.boiteReceptionService.rechercherMessages(this.searchTerm).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
        console.error('Erreur recherche:', err);
      }
    });
  }

  get filteredMessages(): MessageReception[] {
    let filtered = this.messages;

    // Filtre par type
    if (this.typeFilter) {
      filtered = filtered.filter(m => m.type === this.typeFilter);
    }

    // Filtre par priorité
    if (this.prioriteFilter) {
      filtered = filtered.filter(m => m.priorite === this.prioriteFilter);
    }

    // Filtre par statut lu/non lu
    if (this.luFilter === 'lu') {
      filtered = filtered.filter(m => m.lu);
    } else if (this.luFilter === 'non-lu') {
      filtered = filtered.filter(m => !m.lu);
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

  getTypeIcon(type: string): string {
    switch (type) {
      case 'REPONSE': return '💬';
      case 'NOTIFICATION': return '🔔';
      case 'SYSTEME': return '⚙️';
      default: return '📧';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = '';
    this.prioriteFilter = '';
    this.luFilter = '';
    this.chargerMessages();
  }
}
