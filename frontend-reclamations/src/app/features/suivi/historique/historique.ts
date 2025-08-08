import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReclamationService, ReclamationResponseDTO, SuiviReclamationResponseDTO } from '../../../core/services/reclamation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.html',
  styleUrls: ['./historique.css']
})
export class HistoriqueComponent implements OnInit {
  private reclamationService = inject(ReclamationService);
  private authService = inject(AuthService);

  reclamations: ReclamationResponseDTO[] = [];
  selectedReclamation: ReclamationResponseDTO | null = null;
  suiviList: SuiviReclamationResponseDTO[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  statusFilter = '';
  sortBy = 'dateCreation';
  sortOrder: 'asc' | 'desc' = 'desc';

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.loading = true;
    this.error = '';
    
    this.reclamationService.getMesReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        // Sélectionner automatiquement la première réclamation si disponible
        if (this.reclamations.length > 0 && !this.selectedReclamation) {
          this.selectReclamation(this.reclamations[0]);
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des réclamations';
        this.loading = false;
        console.error('Erreur de chargement des réclamations:', err);
      }
    });
  }

  selectReclamation(reclamation: ReclamationResponseDTO): void {
    this.selectedReclamation = reclamation;
    this.loadSuivi(reclamation.id);
  }

  loadSuivi(reclamationId: number): void {
    this.loading = true;
    this.error = '';
    
    this.reclamationService.getHistoriqueReclamation(reclamationId).subscribe({
      next: (data) => {
        this.suiviList = data.sort((a, b) => 
          new Date(b.dateSuivi).getTime() - new Date(a.dateSuivi).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du suivi';
        this.loading = false;
        console.error('Erreur de chargement du suivi:', err);
      }
    });
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'status-waiting';
      case 'EN_COURS': return 'status-progress';
      case 'RESOLU': return 'status-resolved';
      case 'REJETE': return 'status-rejected';
      case 'FERME': return 'status-closed';
      default: return '';
    }
  }

  getStatusIcon(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return '⏳';
      case 'EN_COURS': return '🔄';
      case 'RESOLU': return '✅';
      case 'REJETE': return '❌';
      case 'FERME': return '🔒';
      default: return '';
    }
  }

  get filteredReclamations(): ReclamationResponseDTO[] {
    let filtered = this.reclamations;

    // Filtre par recherche
    if (this.searchTerm) {
      filtered = filtered.filter(rec => 
        (rec.titre?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
        (rec.description?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
        (rec.nomCategorie?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (this.statusFilter) {
      filtered = filtered.filter(rec => rec.statut === this.statusFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (this.sortBy) {
        case 'dateCreation':
          aValue = new Date(a.dateCreation);
          bValue = new Date(b.dateCreation);
          break;
        case 'titre':
          aValue = (a.titre?.toLowerCase() || '');
          bValue = (b.titre?.toLowerCase() || '');
          break;
        case 'statut':
          aValue = a.statut || '';
          bValue = b.statut || '';
          break;
        default:
          aValue = new Date(a.dateCreation);
          bValue = new Date(b.dateCreation);
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.sortBy = 'dateCreation';
    this.sortOrder = 'desc';
  }

  getStatusCount(statut: string): number {
    return this.reclamations.filter(rec => rec.statut === statut).length;
  }

  getTotalReclamations(): number {
    return this.reclamations.length;
  }
} 