import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReclamationResponseDTO } from '../../../core/services/reclamation.service';

interface SuiviReclamation {
  id: number;
  reclamationId: number;
  statut: string;
  commentaire: string;
  dateModification: Date;
  modifiePar: string;
  reclamation?: ReclamationResponseDTO;
}

@Component({
  selector: 'app-gestion-suivi-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-suivi-reclamations.component.html',
  styleUrls: ['./gestion-suivi-reclamations.component.css']
})
export class GestionSuiviReclamationsComponent implements OnInit {
  suiviReclamations: SuiviReclamation[] = [];
  reclamations: ReclamationResponseDTO[] = [];
  loading = false;
  error = '';
  success = '';

  // Filtres
  filtreStatut = '';
  filtreReclamation = '';
  filtreDate = '';

  // Pagination
  pageActuelle = 1;
  elementsParPage = 10;
  totalElements = 0;

  // Édition
  suiviEnEdition: SuiviReclamation | null = null;
  modeEdition = false;

  // Nouveau suivi
  nouveauSuivi = {
    reclamationId: 0,
    statut: '',
    commentaire: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerSuiviReclamations();
    this.chargerReclamations();
  }

  chargerSuiviReclamations(): void {
    this.loading = true;
    this.error = '';
    
    this.http.get<SuiviReclamation[]>('http://localhost:8080/api/user/admin/suivi-reclamations').subscribe({
      next: (data) => {
        this.suiviReclamations = data;
        this.totalElements = data.length;
        this.loading = false;
        console.log('✅ Suivi des réclamations chargé:', this.suiviReclamations);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du suivi:', err);
        this.error = 'Erreur lors du chargement du suivi des réclamations';
        this.loading = false;
      }
    });
  }

  chargerReclamations(): void {
    this.http.get<ReclamationResponseDTO[]>('http://localhost:8080/api/user/reclamations').subscribe({
      next: (data) => {
        this.reclamations = data;
        console.log('✅ Réclamations chargées:', this.reclamations);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des réclamations:', err);
      }
    });
  }

  filtrerSuivi(): void {
    // Logique de filtrage à implémenter
    console.log('🔍 Filtrage du suivi...');
  }

  reinitialiserFiltres(): void {
    this.filtreStatut = '';
    this.filtreReclamation = '';
    this.filtreDate = '';
    this.chargerSuiviReclamations();
  }

  ajouterSuivi(): void {
    if (!this.nouveauSuivi.reclamationId || !this.nouveauSuivi.statut.trim()) {
      this.error = 'La réclamation et le statut sont requis';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const suiviData = {
      reclamationId: this.nouveauSuivi.reclamationId,
      statut: this.nouveauSuivi.statut.trim(),
      commentaire: this.nouveauSuivi.commentaire.trim() || undefined
    };

    this.http.post<SuiviReclamation>('http://localhost:8080/api/user/admin/suivi-reclamations', suiviData).subscribe({
      next: (data) => {
        this.suiviReclamations.unshift(data);
        this.totalElements = this.suiviReclamations.length;
        
        this.success = 'Suivi ajouté avec succès';
        this.nouveauSuivi = { reclamationId: 0, statut: '', commentaire: '' };
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'ajout du suivi:', err);
        this.error = 'Erreur lors de l\'ajout du suivi';
        this.loading = false;
      }
    });
  }

  editerSuivi(suivi: SuiviReclamation): void {
    this.suiviEnEdition = { ...suivi };
    this.modeEdition = true;
    this.error = '';
    this.success = '';
  }

  annulerEdition(): void {
    this.suiviEnEdition = null;
    this.modeEdition = false;
    this.error = '';
    this.success = '';
  }

  sauvegarderSuivi(): void {
    if (!this.suiviEnEdition) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.http.put<SuiviReclamation>(
      `http://localhost:8080/api/user/admin/suivi-reclamations/${this.suiviEnEdition.id}`,
      this.suiviEnEdition
    ).subscribe({
      next: (data) => {
        // Mettre à jour la liste
        const index = this.suiviReclamations.findIndex(s => s.id === data.id);
        if (index !== -1) {
          this.suiviReclamations[index] = data;
        }
        
        this.success = 'Suivi mis à jour avec succès';
        this.modeEdition = false;
        this.suiviEnEdition = null;
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour:', err);
        this.error = 'Erreur lors de la mise à jour du suivi';
        this.loading = false;
      }
    });
  }

  supprimerSuivi(suivi: SuiviReclamation): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce suivi ?`)) {
      this.http.delete(`http://localhost:8080/api/user/admin/suivi-reclamations/${suivi.id}`).subscribe({
        next: () => {
          this.suiviReclamations = this.suiviReclamations.filter(s => s.id !== suivi.id);
          this.totalElements = this.suiviReclamations.length;
          this.success = 'Suivi supprimé avec succès';
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression:', err);
          this.error = 'Erreur lors de la suppression du suivi';
        }
      });
    }
  }

  getReclamationTitre(reclamationId: number): string {
    const reclamation = this.reclamations.find(r => r.id === reclamationId);
    return reclamation ? reclamation.titre : `Réclamation #${reclamationId}`;
  }

  getStatutClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'en cours':
        return 'statut-encours';
      case 'resolu':
        return 'statut-resolu';
      case 'en attente':
        return 'statut-attente';
      case 'annule':
        return 'statut-annule';
      default:
        return 'statut-defaut';
    }
  }

  getStatutDisplay(statut: string): string {
    return statut.charAt(0).toUpperCase() + statut.slice(1).toLowerCase();
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.totalElements / this.elementsParPage);
  }

  get suiviPagination(): SuiviReclamation[] {
    const debut = (this.pageActuelle - 1) * this.elementsParPage;
    const fin = debut + this.elementsParPage;
    return this.suiviReclamations.slice(debut, fin);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pagePrecedente(): void {
    if (this.pageActuelle > 1) {
      this.pageActuelle--;
    }
  }

  pageSuivante(): void {
    if (this.pageActuelle < this.totalPages) {
      this.pageActuelle++;
    }
  }

  allerAPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
    }
  }
}
