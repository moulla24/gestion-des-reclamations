import { Utilisateur } from './utilisateur.model';
import { Categorie } from './categorie.model';

export interface Destinataire extends Utilisateur {
  service: string;
  categorie: Categorie;
}
