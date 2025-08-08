import { Utilisateur } from './utilisateur.model';

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}
