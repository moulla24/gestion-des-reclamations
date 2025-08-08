// src/app/features/reclamation/detail-reclamation/detail-reclamation.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReclamationService, ReclamationResponseDTO, FichierJoint } from '../../../core/services/reclamation.service';

@Component({
  selector: 'app-detail-reclamation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-reclamation.html',
  styleUrls: ['./detail-reclamation.css']
})
export class DetailReclamationComponent implements OnInit {
  reclamationId!: number;
  reclamation: ReclamationResponseDTO | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reclamationId = +id;
        this.chargerReclamation(this.reclamationId);
      }
    });
  }

  chargerReclamation(id: number) {
    this.loading = true;
    this.reclamationService.getReclamationById(id).subscribe({
      next: (data: ReclamationResponseDTO) => {
        this.reclamation = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors du chargement de la réclamation.';
        this.loading = false;
      }
    });
  }

  modifierReclamation() {
    this.router.navigate(['/dashboard/reclamations/edit', this.reclamationId]);
  }

  retourListe() {
    this.router.navigate(['/dashboard/reclamations']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  telechargerFichier(fichier: FichierJoint) {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = fichier.cheminFichier; // This should be the full URL to the file
    link.download = fichier.nomFichier;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
