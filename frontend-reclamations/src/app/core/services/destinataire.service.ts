import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Destinataire } from '../../models/destinataire.model';

@Injectable({
  providedIn: 'root'
})
export class DestinataireService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  // Récupérer tous les destinataires (admin)
  getAllDestinataires(): Observable<Destinataire[]> {
    return this.http.get<Destinataire[]>(`${this.apiUrl}/admin/destinataires`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer les destinataires par catégorie
  getDestinatairesByCategorie(categorieId: number): Observable<Destinataire[]> {
    return this.http.get<Destinataire[]>(`${this.apiUrl}/destinataires/categorie/${categorieId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer un destinataire par ID
  getDestinataireById(id: number): Observable<Destinataire> {
    return this.http.get<Destinataire>(`${this.apiUrl}/admin/destinataires/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Créer un nouveau destinataire
  createDestinataire(destinataire: Partial<Destinataire>): Observable<Destinataire> {
    return this.http.post<Destinataire>(`${this.apiUrl}/admin/destinataires`, destinataire)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour un destinataire
  updateDestinataire(id: number, destinataire: Partial<Destinataire>): Observable<Destinataire> {
    return this.http.put<Destinataire>(`${this.apiUrl}/admin/destinataires/${id}`, destinataire)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supprimer un destinataire
  deleteDestinataire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/destinataires/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Activer un destinataire
  activateDestinataire(id: number): Observable<Destinataire> {
    return this.http.put<Destinataire>(`${this.apiUrl}/admin/destinataires/${id}/activer`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Désactiver un destinataire
  deactivateDestinataire(id: number): Observable<Destinataire> {
    return this.http.put<Destinataire>(`${this.apiUrl}/admin/destinataires/${id}/desactiver`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestion des erreurs
  private handleError(error: any) {
    console.error('❌ Erreur dans DestinataireService:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 401) {
      errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé. Droits insuffisants.';
    } else if (error.status === 404) {
      errorMessage = 'Destinataire non trouvé.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
