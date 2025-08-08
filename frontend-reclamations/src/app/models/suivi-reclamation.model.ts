export interface SuiviReclamation {
  id?: number;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE' | 'FERME';
  commentaire: string;
  dateSuivi: Date;
}
