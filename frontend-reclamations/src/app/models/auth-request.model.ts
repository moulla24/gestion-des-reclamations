export interface AuthRequest {
  email: string;
  motDePasse: string; // Important: 'm' minuscule comme attendu par le backend
  nom?: string;
  prenom?: string;
  telephone?: string;
  role?: 'UTILISATEUR' | 'DESTINATAIRE';
  service?: string; // Pour les destinataires
  categorieId?: number; // Pour les destinataires
  actif?: boolean;
}
