import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface MessageReception {
  id: number;
  titre: string;
  sujet: string;
  contenu: string;
  expediteur: string;
  destinataire: string;
  dateEnvoi: string;
  dateLecture?: string;
  lu: boolean;
  type: 'REPONSE' | 'NOTIFICATION' | 'SYSTEME';
  priorite: 'URGENTE' | 'HAUTE' | 'NORMALE' | 'BASSE';
  pieceJointe?: string;
  taillePieceJointe?: number;
  reclamationId?: number;
}

export interface ReclamationDestinataire {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  statut: string;
  priorite: 'URGENTE' | 'HAUTE' | 'NORMALE' | 'BASSE';
  expediteur: string;
  categorie: string;
  lu: boolean;
  dateLecture?: string;
  fichierJoint?: string;
}

export interface StatistiquesBoiteReception {
  totalMessages: number;
  messagesNonLus: number;
  messagesLus: number;
  messagesUrgents: number;
  messagesReponses: number;
  messagesNotifications: number;
  messagesSysteme: number;
  messagesAujourdhui: number;
  tailleTotale: number;
}

@Injectable({
  providedIn: 'root'
})
export class BoiteReceptionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = 'http://localhost:8080/api/user/boite-reception';

  // Récupérer les réclamations destinées au destinataire connecté
  getReclamationsDestinataire(): Observable<ReclamationDestinataire[]> {
    return this.http.get<ReclamationDestinataire[]>(`${this.baseUrl}/reclamations-destinataire`);
  }

  // Récupérer tous les messages (pour compatibilité)
  getMessages(): Observable<MessageReception[]> {
    return this.http.get<MessageReception[]>(this.baseUrl);
  }

  // Récupérer les statistiques
  getStatistiques(): Observable<StatistiquesBoiteReception> {
    return this.http.get<StatistiquesBoiteReception>(`${this.baseUrl}/statistiques`);
  }

  // Marquer une réclamation comme lue
  marquerReclamationCommeLue(reclamationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/reclamations/${reclamationId}/lu`, {});
  }

  // Marquer un message comme lu
  marquerCommeLu(messageId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${messageId}/lu`, {});
  }

  // Marquer un message comme non lu
  marquerCommeNonLu(messageId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${messageId}/non-lu`, {});
  }

  // Supprimer un message
  supprimerMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${messageId}`);
  }

  // Marquer plusieurs messages comme lus
  marquerPlusieursCommeLus(messageIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/marquer-plusieurs-lus`, { messageIds });
  }

  // Supprimer plusieurs messages
  supprimerPlusieursMessages(messageIds: number[]): Observable<any> {
    return this.http.delete(`${this.baseUrl}/supprimer-plusieurs`, { body: { messageIds } });
  }

  // Marquer tous les messages comme lus
  marquerTousCommeLus(): Observable<any> {
    return this.http.put(`${this.baseUrl}/marquer-tous-lus`, {});
  }

  // Vider la boîte de réception
  viderBoiteReception(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vider`);
  }

  // Rechercher des messages
  rechercherMessages(terme: string): Observable<MessageReception[]> {
    return this.http.get<MessageReception[]>(`${this.baseUrl}/recherche?q=${encodeURIComponent(terme)}`);
  }

  // Rechercher des réclamations
  rechercherReclamations(terme: string): Observable<ReclamationDestinataire[]> {
    return this.http.get<ReclamationDestinataire[]>(`${this.baseUrl}/reclamations-recherche?q=${encodeURIComponent(terme)}`);
  }

  // Télécharger une pièce jointe
  telechargerPieceJointe(messageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${messageId}/piece-jointe`, { responseType: 'blob' });
  }

  // Télécharger un fichier joint d'une réclamation
  telechargerFichierReclamation(reclamationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reclamations/${reclamationId}/fichier`, { responseType: 'blob' });
  }
}
