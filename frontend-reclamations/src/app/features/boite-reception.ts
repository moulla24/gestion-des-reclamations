import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService, ReclamationResponseDTO } from 'src/app/core/services/reclamation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-boite-reception',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './boite-reception.html',
  styleUrls: ['./boite-reception.css']
})
export class BoiteReceptionComponent implements OnInit {
  reclamations: ReclamationResponseDTO[] = [];
  destinataireId: number = 0; // à récupérer dynamiquement si besoin

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    // ⚠️ À remplacer par la vraie récupération de l'ID depuis le JWT ou AuthService
    this.destinataireId = 453;
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getReclamationsDestinataire()
      .subscribe({
        next: data => this.reclamations = data,
        error: err => console.error('Erreur chargement réclamations', err)
      });
  }
}
