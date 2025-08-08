import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService, ReclamationResponseDTO } from '../../../core/services/reclamation.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-reclamations.component.html',
  styleUrls: ['./list-reclamations.component.css']
})
export class ListReclamationsComponent implements OnInit {
  reclamations: ReclamationResponseDTO[] = [];
  error = '';
  success = '';
  loading = false;
  filtreStatut = '';

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerReclamations();
  }

  chargerReclamations() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.reclamationService.getMesReclamations().subscribe({
      next: (data: ReclamationResponseDTO[]) => {
        this.reclamations = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors du chargement des réclamations.';
        this.loading = false;
      }
    });
  }

  voirDetails(id: number) {
    this.router.navigate(['/dashboard/reclamations/detail', id]);
  }

  modifier(id: number) {
    this.router.navigate(['/dashboard/reclamations/edit', id]);
  }

  supprimer(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.error = '';
      this.success = '';
      this.reclamationService.supprimerReclamation(id).subscribe({
        next: () => {
          this.reclamations = this.reclamations.filter(r => r.id !== id);
          this.success = 'Réclamation supprimée avec succès.';
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Erreur lors de la suppression.';
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.error = '';
          }, 5000);
        }
      });
    }
  }

  get reclamationsFiltrees() {
    if (!this.filtreStatut) return this.reclamations;
    return this.reclamations.filter(r => r.statut === this.filtreStatut);
  }
}
