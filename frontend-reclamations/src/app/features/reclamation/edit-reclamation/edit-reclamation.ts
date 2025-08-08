import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReclamationService, ReclamationUpdateDTO } from '../../../core/services/reclamation.service';
import { Categorie } from '../../../models/categorie.model';
import { Destinataire } from '../../../models/destinataire.model';

@Component({
  selector: 'app-edit-reclamation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-reclamation.html',
  styleUrls: ['./edit-reclamation.css']
})
export class EditReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  reclamationId!: number;

  categories: Categorie[] = [];
  destinataires: Destinataire[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.reclamationId = +this.route.snapshot.paramMap.get('id')!;

    // Init formulaire
    this.reclamationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      categorieId: [null, Validators.required],
      destinataireId: [null, Validators.required],
    });
    
    // Charger catégories
    this.reclamationService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Erreur récupération catégories', err);
        this.error = 'Erreur lors du chargement des catégories';
      }
    });

    // Charger la réclamation et patcher formulaire
    this.reclamationService.getReclamationById(this.reclamationId).subscribe({
      next: (data) => {
        // Since ReclamationResponseDTO only has nomCategorie and nomDestinataire as strings,
        // we need to find the corresponding IDs by matching the names
        const categorie = this.categories.find(cat => cat.libelle === data.nomCategorie);
        const categorieId = categorie?.id || null;
        
        // We'll need to load destinataires for this category to find the correct ID
        if (categorieId) {
          this.chargerDestinataires(categorieId).then(() => {
            const destinataire = this.destinataires.find(dest => 
              (dest.nom || dest.prenom || dest.email) === data.nomDestinataire
            );
            const destinataireId = destinataire?.id || null;
            
            this.reclamationForm.patchValue({
              titre: data.titre,
              description: data.description,
              categorieId: categorieId,
              destinataireId: destinataireId
            });
          });
        } else {
          // If we can't find the category, just patch the basic fields
          this.reclamationForm.patchValue({
            titre: data.titre,
            description: data.description,
            categorieId: null,
            destinataireId: null
          });
        }
      },
      error: (err) => {
        console.error('Erreur récupération réclamation', err);
        this.error = 'Erreur lors du chargement de la réclamation';
      }
    });

    // Quand la catégorie change, on recharge la liste des destinataires
    this.reclamationForm.get('categorieId')?.valueChanges.subscribe(catId => {
      this.chargerDestinataires(catId);
      // Reset destinataire à null quand la catégorie change
      this.reclamationForm.get('destinataireId')?.setValue(null);
    });
  }

  async chargerDestinataires(categorieId: number): Promise<void> {
    if (!categorieId) {
      this.destinataires = [];
      return;
    }
    
    try {
      const destinataires = await this.reclamationService.getDestinatairesByCategorie(categorieId).toPromise();
      this.destinataires = destinataires || [];
    } catch (error) {
      console.error('Erreur chargement destinataires', error);
      this.destinataires = [];
    }
  }

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formValue = this.reclamationForm.value;

    const dto: ReclamationUpdateDTO = {
      titre: formValue.titre,
      description: formValue.description,
      categorieId: formValue.categorieId,
      destinataireId: formValue.destinataireId,
    };

    this.reclamationService.modifierReclamation(this.reclamationId, dto).subscribe({
      next: () => {
        alert('Réclamation mise à jour avec succès !');
        this.router.navigate(['/dashboard/reclamations']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }

  retourListe(): void {
    this.router.navigate(['/dashboard/reclamations']);
  }
}
