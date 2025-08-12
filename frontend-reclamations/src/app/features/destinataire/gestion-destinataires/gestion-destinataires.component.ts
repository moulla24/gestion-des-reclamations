import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ReclamationService } from '../../../core/services/reclamation.service';

interface Destinataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  service: string;
  categorieId: number;
  categorieNom: string;
  actif: boolean;
  dateCreation: string;
  nombreReclamations: number;
  reclamationsResolues: number;
}

interface Categorie {
  id: number;
  nom: string;
  description: string;
}

@Component({
  selector: 'app-gestion-destinataires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-destinataires.component.html',
  styleUrls: ['./gestion-destinataires.component.css']
})
export class GestionDestinatairesComponent implements OnInit {
  destinataires: Destinataire[] = [];
  categories: Categorie[] = [];
  loading = false;
  error = '';
  success = '';

  // Filtres
  filtreService = '';
  filtreCategorie = '';
  filtreStatut = '';

  // Pagination
  pageActuelle = 1;
  elementsParPage = 10;
  totalElements = 0;

  // Mode édition
  destinataireEnEdition: Destinataire | null = null;
  modeEdition = false;

  constructor(
    private authService: AuthService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.chargerDestinataires();
    this.chargerCategories();
  }

  chargerDestinataires(): void {
    this.loading = true;
    this.error = '';
    
    this.reclamationService.getDestinataires().subscribe({
      next: (data: any[]) => {
        console.log('✅ Destinataires chargés:', data);
        
        // Transformer les données pour correspondre à l'interface Destinataire
        this.destinataires = data.map(dest => ({
          id: dest.id,
          nom: dest.nom || '',
          prenom: dest.prenom || '',
          email: dest.email || '',
          telephone: dest.telephone || '',
          service: dest.service || '',
          categorieId: dest.categorieId || dest.categorie?.id || 0,
          categorieNom: dest.categorieNom || dest.categorie?.libelle || '',
          actif: dest.actif !== undefined ? dest.actif : true,
          dateCreation: dest.dateCreation || new Date().toISOString(),
          nombreReclamations: dest.nombreReclamations || 0,
          reclamationsResolues: dest.reclamationsResolues || 0
        }));
        
        this.totalElements = this.destinataires.length;
        this.loading = false;
        console.log('👥 Destinataires transformés:', this.destinataires);
      },
      error: (err: any) => {
        console.error('❌ Erreur lors du chargement des destinataires:', err);
        this.error = 'Erreur lors du chargement des destinataires';
        this.loading = false;
      }
    });
  }

  chargerCategories(): void {
    // Charger les catégories disponibles
    this.reclamationService.getCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  filtrerDestinataires(): void {
    // Logique de filtrage
    this.pageActuelle = 1;
    this.chargerDestinataires();
  }

  reinitialiserFiltres(): void {
    this.filtreService = '';
    this.filtreCategorie = '';
    this.filtreStatut = '';
    this.filtrerDestinataires();
  }

  editerDestinataire(destinataire: Destinataire): void {
    this.destinataireEnEdition = { ...destinataire };
    this.modeEdition = true;
    this.error = '';
    this.success = '';
  }

  annulerEdition(): void {
    this.modeEdition = false;
    this.destinataireEnEdition = null;
  }

  sauvegarderDestinataire(): void {
    if (!this.destinataireEnEdition) return;

    this.loading = true;
    // Ici, vous devrez implémenter l'appel au service pour mettre à jour le destinataire
    // Pour l'instant, on simule
    setTimeout(() => {
      this.success = 'Destinataire mis à jour avec succès';
      this.modeEdition = false;
      this.destinataireEnEdition = null;
      this.loading = false;
      this.chargerDestinataires();
      setTimeout(() => this.success = '', 3000);
    }, 1000);
  }

  activerDestinataire(destinataire: Destinataire): void {
    if (confirm(`Voulez-vous activer le destinataire ${destinataire.prenom} ${destinataire.nom} ?`)) {
      // Logique d'activation
      this.success = 'Destinataire activé avec succès';
      setTimeout(() => this.success = '', 3000);
    }
  }

  desactiverDestinataire(destinataire: Destinataire): void {
    if (confirm(`Voulez-vous désactiver le destinataire ${destinataire.prenom} ${destinataire.nom} ?`)) {
      // Logique de désactivation
      this.success = 'Destinataire désactivé avec succès';
      setTimeout(() => this.success = '', 3000);
    }
  }

  supprimerDestinataire(destinataire: Destinataire): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le destinataire ${destinataire.prenom} ${destinataire.nom} ? Cette action est irréversible.`)) {
      // Logique de suppression
      this.success = 'Destinataire supprimé avec succès';
      setTimeout(() => this.success = '', 3000);
    }
  }

  getCategorieNom(categorieId: number): string {
    const categorie = this.categories.find(c => c.id === categorieId);
    return categorie ? categorie.nom : 'Inconnue';
  }

  getStatutClass(actif: boolean): string {
    return actif ? 'statut-actif' : 'statut-inactif';
  }

  getStatutDisplay(actif: boolean): string {
    return actif ? 'Actif' : 'Inactif';
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.totalElements / this.elementsParPage);
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
      this.chargerDestinataires();
    }
  }

  getElementsAffichage(): string {
    const debut = (this.pageActuelle - 1) * this.elementsParPage + 1;
    const fin = Math.min(this.pageActuelle * this.elementsParPage, this.totalElements);
    return `${debut}-${fin} sur ${this.totalElements}`;
  }
}
