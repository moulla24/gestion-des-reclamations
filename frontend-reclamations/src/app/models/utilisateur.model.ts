export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone?: string;
  role: 'UTILISATEUR'; // Toujours UTILISATEUR
  type_utilisateur: 'DESTINATAIRE' | 'UTILISATEUR'; // Détermine la table
}
