import { Utilisateur } from './utilisateur.model';
import { Destinataire } from './destinataire.model';
import { Categorie } from './categorie.model';
import { FichierJoint } from './fichier-joint.model';
import { SuiviReclamation } from './suivi-reclamation.model';

export interface Reclamation {
  id?: number;
  titre: string;
  description: string;
  statut?: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE' | 'FERME';
  dateCreation?: Date;
  utilisateur?: Utilisateur;
  destinataire: Destinataire;
  categorie: Categorie;
  fichiersJoints?: FichierJoint[];
  suivis?: SuiviReclamation[];
}
