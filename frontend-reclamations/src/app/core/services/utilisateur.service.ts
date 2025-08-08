import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/models/utilisateur.model';

export interface ProfilUtilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  type_utilisateur: string;
  actif: boolean;
  dateCreation: string;
  derniereConnexion: string;
  nombreReclamations: number;
  reclamationsResolues: number;
  reclamationsEnCours: number;
}

export interface StatistiquesUtilisateur {
  totalReclamations: number;
  reclamationsEnAttente: number;
  reclamationsEnCours: number;
  reclamationsResolues: number;
  reclamationsRejetees: number;
  reclamationsFermees: number;
  tauxResolution: number;
  tempsMoyenResolution: number;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/user';

  // Récupérer le profil de l'utilisateur connecté
  getProfil(): Observable<ProfilUtilisateur> {
    return this.http.get<ProfilUtilisateur>(`${this.baseUrl}/profil`);
  }

  // Mettre à jour le profil utilisateur
  updateProfil(profil: Partial<ProfilUtilisateur>): Observable<ProfilUtilisateur> {
    return this.http.put<ProfilUtilisateur>(`${this.baseUrl}/profil`, profil);
  }

  // Changer le mot de passe
  changerMotDePasse(ancienMotDePasse: string, nouveauMotDePasse: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/changer-mot-de-passe`, {
      ancienMotDePasse,
      nouveauMotDePasse
    });
  }

  // Récupérer les statistiques de l'utilisateur
  getStatistiques(): Observable<StatistiquesUtilisateur> {
    return this.http.get<StatistiquesUtilisateur>(`${this.baseUrl}/statistiques`);
  }

  // Récupérer l'historique des connexions
  getHistoriqueConnexions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/historique-connexions`);
  }

  // Désactiver le compte
  desactiverCompte(): Observable<any> {
    return this.http.post(`${this.baseUrl}/desactiver-compte`, {});
  }

  // Récupérer les notifications
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`);
  }

  // Marquer une notification comme lue
  marquerNotificationLue(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/lue`, {});
  }

  // Supprimer une notification
  supprimerNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${notificationId}`);
  }
}
