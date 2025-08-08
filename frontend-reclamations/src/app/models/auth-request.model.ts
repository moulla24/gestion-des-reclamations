export interface AuthRequest {
  email: string;
  motDePasse: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role?: string;
  type_utilisateur?: string;
  actif?: boolean;
}
