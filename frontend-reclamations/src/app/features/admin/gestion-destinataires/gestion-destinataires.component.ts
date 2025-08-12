import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinataireService } from '../../../core/services/destinataire.service';
import { Destinataire } from '../../../models/destinataire.model';
import { Categorie } from '../../../models/categorie.model';

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

  // Édition
  destinataireEnEdition: Destinataire | null = null;
  modeEdition = false;

  constructor(private destinataireService: DestinataireService) {}

  ngOnInit(): void {
    this.chargerDestinataires();
    this.chargerCategories();
  }

  chargerDestinataires(): void {
    this.loading = true;
    this.error = '';
    
    this.destinataireService.getAllDestinataires().subscribe({
      next: (data) => {
        this.destinataires = data;
        this.totalElements = data.length;
        this.loading = false;
        console.log('✅ Destinataires chargés:', this.destinataires);
        
        // Afficher un message si aucun destinataire
        if (data.length === 0) {
          this.success = 'Aucun destinataire trouvé. La liste est vide.';
          setTimeout(() => this.success = '', 5000);
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des destinataires:', err);
        this.error = err.message || 'Erreur lors du chargement des destinataires';
        this.loading = false;
        
        // Ne pas réinitialiser la liste en cas d'erreur
        if (this.destinataires.length === 0) {
          this.error += '. Veuillez vérifier votre connexion et réessayer.';
        }
      }
    });
  }

  chargerCategories(): void {
    // Utiliser le service existant ou créer un appel direct
    this.destinataireService.getAllDestinataires().subscribe({
      next: (data) => {
        // Extraire les catégories uniques des destinataires
        const categoriesUniques = new Map<number, Categorie>();
        data.forEach(dest => {
          if (dest.categorie && dest.categorie.id && !categoriesUniques.has(dest.categorie.id)) {
            categoriesUniques.set(dest.categorie.id, dest.categorie);
          }
        });
        this.categories = Array.from(categoriesUniques.values());
        console.log('✅ Catégories extraites:', this.categories);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des catégories:', err);
        // Ne pas bloquer l'affichage des destinataires
      }
    });
  }

  filtrerDestinataires(): void {
    // Logique de filtrage côté client
    let filtered = [...this.destinataires];
    
    if (this.filtreService) {
      filtered = filtered.filter(d => 
        d.service?.toLowerCase().includes(this.filtreService.toLowerCase())
      );
    }
    
    if (this.filtreCategorie) {
      filtered = filtered.filter(d => 
        d.categorie?.id?.toString() === this.filtreCategorie
      );
    }
    
    if (this.filtreStatut) {
      const statutActif = this.filtreStatut === 'true';
      filtered = filtered.filter(d => d.actif === statutActif);
    }
    
    this.totalElements = filtered.length;
    this.pageActuelle = 1; // Retour à la première page
    console.log('🔍 Filtrage appliqué:', filtered.length, 'destinataires trouvés');
  }

  reinitialiserFiltres(): void {
    this.filtreService = '';
    this.filtreCategorie = '';
    this.filtreStatut = '';
    this.totalElements = this.destinataires.length;
    this.pageActuelle = 1;
    console.log('🔄 Filtres réinitialisés');
  }

  editerDestinataire(destinataire: Destinataire): void {
    this.destinataireEnEdition = { ...destinataire };
    this.modeEdition = true;
    this.error = '';
    this.success = '';
  }

  annulerEdition(): void {
    this.destinataireEnEdition = null;
    this.modeEdition = false;
    this.error = '';
    this.success = '';
  }

  sauvegarderDestinataire(): void {
    if (!this.destinataireEnEdition?.id) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.destinataireService.updateDestinataire(this.destinataireEnEdition.id!, this.destinataireEnEdition).subscribe({
      next: (data) => {
        // Mettre à jour la liste
        const index = this.destinataires.findIndex(d => d.id === data.id);
        if (index !== -1) {
          this.destinataires[index] = data;
        }
        
        this.success = 'Destinataire mis à jour avec succès';
        this.modeEdition = false;
        this.destinataireEnEdition = null;
        this.loading = false;
        
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour:', err);
        this.error = err.message || 'Erreur lors de la mise à jour du destinataire';
        this.loading = false;
      }
    });
  }

  activerDestinataire(destinataire: Destinataire): void {
    if (!destinataire.id) return;
    
    this.destinataireService.activateDestinataire(destinataire.id!).subscribe({
      next: (data) => {
        // Mettre à jour le statut
        const index = this.destinataires.findIndex(d => d.id === data.id);
        if (index !== -1) {
          this.destinataires[index] = data;
        }
        this.success = 'Destinataire activé avec succès';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'activation:', err);
        this.error = err.message || 'Erreur lors de l\'activation du destinataire';
      }
    });
  }

  desactiverDestinataire(destinataire: Destinataire): void {
    if (!destinataire.id) return;
    
    this.destinataireService.deactivateDestinataire(destinataire.id!).subscribe({
      next: (data) => {
        // Mettre à jour le statut
        const index = this.destinataires.findIndex(d => d.id === data.id);
        if (index !== -1) {
          this.destinataires[index] = data;
        }
        this.success = 'Destinataire désactivé avec succès';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la désactivation:', err);
        this.error = err.message || 'Erreur lors de la désactivation du destinataire';
      }
    });
  }

  supprimerDestinataire(destinataire: Destinataire): void {
    if (!destinataire.id) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le destinataire "${destinataire.prenom} ${destinataire.nom}" ?`)) {
      this.destinataireService.deleteDestinataire(destinataire.id!).subscribe({
        next: () => {
          this.destinataires = this.destinataires.filter(d => d.id !== destinataire.id);
          this.totalElements = this.destinataires.length;
          this.success = 'Destinataire supprimé avec succès';
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression:', err);
          this.error = err.message || 'Erreur lors de la suppression du destinataire';
        }
      });
    }
  }

  getCategorieNom(categorieId: number): string {
    const categorie = this.categories.find(c => c.id === categorieId);
    return categorie ? categorie.libelle : 'Inconnue';
  }

  getStatutClass(actif: boolean | undefined): string {
    return actif ? 'statut-actif' : 'statut-inactif';
  }

  getStatutDisplay(actif: boolean | undefined): string {
    return actif ? 'Actif' : 'Inactif';
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.totalElements / this.elementsParPage);
  }

  get destinatairesPagination(): Destinataire[] {
    const debut = (this.pageActuelle - 1) * this.elementsParPage;
    const fin = debut + this.elementsParPage;
    return this.destinataires.slice(debut, fin);
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
