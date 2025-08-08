import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamationService, ReclamationResponseDTO } from '../../../core/services/reclamation.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-gestion-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-reclamations.component.html',
  styleUrls: ['./gestion-reclamations.component.css']
})
export class GestionReclamationsComponent implements OnInit {
  private reclamationService = inject(ReclamationService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  reclamations: ReclamationResponseDTO[] = [];
  selectedReclamation: ReclamationResponseDTO | null = null;
  loading = false;
  error = '';
  
  // Filtres
  statutFilter = '';
  prioriteFilter = '';
  dateFilter = '';
  searchTerm = '';
  
  // Formulaire de mise à jour
  updateForm: FormGroup;
  showUpdateForm = false;

  // Statistiques
  statistiques = {
    total: 0,
    enAttente: 0,
    enCours: 0,
    resolues: 0,
    rejetees: 0
  };

  constructor() {
    this.updateForm = this.fb.group({
      nouveauStatut: ['', Validators.required],
      commentaire: ['', Validators.required],
      priorite: ['NORMALE', Validators.required],
      dateResolution: ['']
    });
  }

  ngOnInit(): void {
    this.chargerReclamations();
    this.chargerStatistiques();
  }

  chargerReclamations(): void {
    this.loading = true;
    this.error = '';
    
    this.reclamationService.getReclamationsDestinataire().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        this.calculerStatistiques();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des réclamations';
        this.loading = false;
        console.error('Erreur de chargement:', err);
      }
    });
  }

  chargerStatistiques(): void {
    this.reclamationService.getStatistiquesDestinataire().subscribe({
      next: (data) => {
        this.statistiques = data;
      },
      error: (err) => {
        console.error('Erreur de chargement des statistiques:', err);
      }
    });
  }

  calculerStatistiques(): void {
    this.statistiques = {
      total: this.reclamations.length,
      enAttente: this.reclamations.filter(r => r.statut === 'EN_ATTENTE').length,
      enCours: this.reclamations.filter(r => r.statut === 'EN_COURS').length,
      resolues: this.reclamations.filter(r => r.statut === 'RESOLU').length,
      rejetees: this.reclamations.filter(r => r.statut === 'REJETE').length
    };
  }

  selectReclamation(reclamation: ReclamationResponseDTO): void {
    this.selectedReclamation = reclamation;
    this.showUpdateForm = false;
  }

  ouvrirFormulaireMiseAJour(): void {
    if (!this.selectedReclamation) return;
    
    this.updateForm.patchValue({
      nouveauStatut: this.selectedReclamation.statut,
      commentaire: '',
      priorite: 'NORMALE',
      dateResolution: ''
    });
    this.showUpdateForm = true;
  }

  soumettreMiseAJour(): void {
    if (this.updateForm.invalid || !this.selectedReclamation) return;

    const updateData = this.updateForm.value;
    
    this.reclamationService.mettreAJourReclamationDestinataire(
      this.selectedReclamation.id,
      updateData
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Réclamation mise à jour avec succès');
        this.chargerReclamations();
        this.showUpdateForm = false;
        this.updateForm.reset();
      },
      error: (err) => {
        this.notificationService.showError('Erreur lors de la mise à jour');
        console.error('Erreur mise à jour:', err);
      }
    });
  }

  annulerMiseAJour(): void {
    this.showUpdateForm = false;
    this.updateForm.reset();
  }

  get filteredReclamations(): ReclamationResponseDTO[] {
    let filtered = this.reclamations;

    // Filtre par statut
    if (this.statutFilter) {
      filtered = filtered.filter(r => r.statut === this.statutFilter);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        (r.titre?.toLowerCase() || '').includes(term) ||
        (r.description?.toLowerCase() || '').includes(term) ||
        (r.emailUtilisateur?.toLowerCase() || '').includes(term)
      );
    }

    // Filtre par date
    if (this.dateFilter) {
      const today = new Date();
      const filterDate = new Date(this.dateFilter);
      
      switch (this.dateFilter) {
        case 'aujourdhui':
          filtered = filtered.filter(r => {
            const dateCreation = new Date(r.dateCreation);
            return dateCreation.toDateString() === today.toDateString();
          });
          break;
        case 'semaine':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(r => {
            const dateCreation = new Date(r.dateCreation);
            return dateCreation >= weekAgo;
          });
          break;
        case 'mois':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter(r => {
            const dateCreation = new Date(r.dateCreation);
            return dateCreation >= monthAgo;
          });
          break;
      }
    }

    return filtered;
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'statut-attente';
      case 'EN_COURS': return 'statut-encours';
      case 'RESOLU': return 'statut-resolu';
      case 'REJETE': return 'statut-rejete';
      case 'FERME': return 'statut-ferme';
      default: return '';
    }
  }

  getStatutIcon(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return '⏳';
      case 'EN_COURS': return '🔄';
      case 'RESOLU': return '✅';
      case 'REJETE': return '❌';
      case 'FERME': return '🔒';
      default: return '📋';
    }
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

  clearFilters(): void {
    this.statutFilter = '';
    this.prioriteFilter = '';
    this.dateFilter = '';
    this.searchTerm = '';
  }

  telechargerFichier(fichier: any): void {
    this.reclamationService.telechargerFichier(fichier.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fichier.nomFichier;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        this.notificationService.showError('Erreur lors du téléchargement');
        console.error('Erreur téléchargement:', err);
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
