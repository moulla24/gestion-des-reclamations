import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie } from 'src/app/models/categorie.model';
import { Destinataire } from 'src/app/models/destinataire.model';
import { HttpClient } from '@angular/common/http';
import { Reclamation } from 'src/app/models/reclamation.model';
import { SuiviReclamation } from 'src/app/models/suivi-reclamation.model';

export interface ReclamationUpdateDTO {
  titre: string;
  description: string;
  categorieId: number;
  destinataireId: number;
}

export interface FichierJoint {
  id: number;
  nomFichier: string;
  cheminFichier: string;
  typeMime: string;
  tailleFichier: number;
  dateUpload: string;
}

export interface ReclamationResponseDTO {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE' | 'FERME';
  emailUtilisateur: string;
  nomCategorie: string;
  nomDestinataire: string;
  fichiersJoints?: FichierJoint[];
}

export interface SuiviReclamationResponseDTO {
  id: number;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE' | 'FERME';
  commentaire: string;
  dateSuivi: string;
}

export interface StatistiquesReclamations {
  totalReclamations: number;
  reclamationsEnAttente: number;
  reclamationsEnCours: number;
  reclamationsResolues: number;
  reclamationsRejetees: number;
  reclamationsFermees: number;
  tauxResolution: number;
  tempsMoyenResolution: number;
  reclamationsCeMois: number;
  reclamationsCetteSemaine: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private http = inject(HttpClient);
  private readonly baseUrlUser = 'http://localhost:8080/api/user';
  private readonly baseUrlAdmin = 'http://localhost:8080/api/user/admin';
  private readonly apiUrl = 'http://localhost:8080/api/reclamations';

  // Soumettre une nouvelle réclamation (utilisateur)
  soumettreReclamation(dto: {
    titre: string;
    description: string;
    categorieId: number;
    destinataireId: number;
    fichierJointId?: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/reclamations/soumettre`, dto);
  }

  // Récupérer les réclamations de l'utilisateur connecté
  getMesReclamations(): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations`);
  }

  // Récupérer une réclamation par ID
  getReclamationById(id: number): Observable<ReclamationResponseDTO> {
    return this.http.get<ReclamationResponseDTO>(`${this.baseUrlUser}/reclamations/${id}`);
  }

  // Récupérer toutes les catégories
  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.baseUrlUser}/categories`);
  }

  // Récupérer destinataires par catégorie
  getDestinatairesByCategorie(categorieId: number): Observable<Destinataire[]> {
    return this.http.get<Destinataire[]>(`${this.baseUrlUser}/destinataires/by-categorie/${categorieId}`);
  }

  // Modifier une réclamation
  modifierReclamation(id: number, dto: ReclamationUpdateDTO): Observable<any> {
    return this.http.put(`${this.baseUrlUser}/reclamations/${id}`, dto);
  }

  // Supprimer une réclamation
  supprimerReclamation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlUser}/reclamations/${id}`);
  }

  // Ajouter un suivi à une réclamation
  ajouterSuivi(idReclamation: number, message: string): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/reclamations/${idReclamation}/suivis`, { message });
  }

  // Récupérer les suivis d'une réclamation
  getSuivisReclamation(idReclamation: number): Observable<SuiviReclamationResponseDTO[]> {
    return this.http.get<SuiviReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/${idReclamation}/suivis`);
  }

  // Récupérer l'historique d'une réclamation (alias pour getSuivisReclamation)
  getHistoriqueReclamation(idReclamation: number): Observable<SuiviReclamationResponseDTO[]> {
    return this.http.get<SuiviReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/${idReclamation}/suivi`);
  }

  // ADMIN : Liste de toutes les réclamations
  getAllReclamations(): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlAdmin}/reclamations`);
  }

  // ADMIN : Changer le statut d'une réclamation
  changerStatut(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.baseUrlAdmin}/reclamations/${id}/statut`, { statut });
  }

  // Récupérer tous les destinataires
  getDestinataires(): Observable<Destinataire[]> {
    return this.http.get<Destinataire[]>(`${this.baseUrlUser}/destinataires`);
  }
  
  // Ajouter une nouvelle catégorie
  ajouterCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.baseUrlUser}/categories`, categorie);
  }

  // Modifier une catégorie
  modifierCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.baseUrlUser}/categories/${id}`, categorie);
  }

  // Supprimer une catégorie
  supprimerCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlUser}/categories/${id}`);
  }

  // Ajouter un nouveau destinataire
  ajouterDestinataire(destinataire: Destinataire): Observable<Destinataire> {
    return this.http.post<Destinataire>(`${this.baseUrlUser}/destinataires`, destinataire);
  }

  // Upload de fichier joint
  uploadFichier(fichier: File, reclamationId: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', fichier, fichier.name);

    return this.http.post<string>(
      `http://localhost:8080/api/fichiers/upload/${reclamationId}`,
      formData
    );
  }

  // Récupérer les fichiers joints d'une réclamation
  getFichiersJoints(idReclamation: number): Observable<FichierJoint[]> {
    return this.http.get<FichierJoint[]>(`${this.baseUrlUser}/reclamations/${idReclamation}/fichiers`);
  }

  // Récupérer les réclamations d'un destinataire par ID
  getReclamationsDestinataireById(id: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/user/reclamations/${id}`);
  }

  // Récupérer les réclamations de l'utilisateur (alias)
  getUserReclamations(): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.apiUrl}/mes-reclamations`);
  }

  // Récupérer les suivis par ID de réclamation (alias)
  getSuivisByReclamationId(reclamationId: number): Observable<SuiviReclamationResponseDTO[]> {
    return this.http.get<SuiviReclamationResponseDTO[]>(`/api/user/reclamations/${reclamationId}/suivi`);
  }

  // Récupérer les statistiques des réclamations
  getStatistiques(): Observable<StatistiquesReclamations> {
    return this.http.get<StatistiquesReclamations>(`${this.baseUrlUser}/reclamations/statistiques`);
  }

  // Rechercher des réclamations
  rechercherReclamations(terme: string): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/recherche?q=${terme}`);
  }

  // Filtrer les réclamations par statut
  filtrerParStatut(statut: string): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/filtre/statut/${statut}`);
  }

  // Filtrer les réclamations par catégorie
  filtrerParCategorie(categorieId: number): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/filtre/categorie/${categorieId}`);
  }

  // Récupérer les réclamations par période
  getReclamationsParPeriode(debut: string, fin: string): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/reclamations/periode?debut=${debut}&fin=${fin}`);
  }

  // Exporter les réclamations
  exporterReclamations(format: 'pdf' | 'excel' | 'csv'): Observable<Blob> {
    return this.http.get(`${this.baseUrlUser}/reclamations/export/${format}`, { responseType: 'blob' });
  }

  // Méthodes pour les destinataires
  getReclamationsDestinataire(): Observable<ReclamationResponseDTO[]> {
    return this.http.get<ReclamationResponseDTO[]>(`${this.baseUrlUser}/destinataire/reclamations`);
  }

  getStatistiquesDestinataire(): Observable<any> {
    return this.http.get<any>(`${this.baseUrlUser}/destinataire/statistiques`);
  }

  mettreAJourReclamationDestinataire(reclamationId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.baseUrlUser}/destinataire/reclamations/${reclamationId}`, updateData);
  }

  telechargerFichier(fichierId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/api/fichiers/download/${fichierId}`, { responseType: 'blob' });
  }
}


