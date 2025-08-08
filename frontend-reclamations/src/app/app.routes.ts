// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { Dashboard } from './features/dashboard/dashboard';
import { ListReclamationsComponent } from './features/reclamation/list-reclamations/list-reclamations.component';
import { AddReclamationComponent } from './features/reclamation/add-reclamation/add-reclamation.component';
import { HistoriqueComponent } from './features/suivi/historique/historique';
import { ProfilComponent } from './features/utilisateur/profil/profil.component';
import { DetailReclamationComponent } from './features/reclamation/detail-reclamation/detail-reclamation';
import { EditReclamationComponent } from './features/reclamation/edit-reclamation/edit-reclamation';
import { GestionReclamationsComponent } from './features/suivi/gestion-reclamations/gestion-reclamations.component';
import { GestionCategoriesComponent } from './features/categories/gestion-categories/gestion-categories.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard],
    children: [
      { path: 'reclamations', component: ListReclamationsComponent },
      { path: 'nouvelle-reclamation', component: AddReclamationComponent },
      { path: 'mes-reclamations', component: ListReclamationsComponent },
      { path: 'historique', component: HistoriqueComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'gestion-reclamations', component: GestionReclamationsComponent },
      { path: 'gestion-categories', component: GestionCategoriesComponent },
      { path: 'reclamations/detail/:id', component: DetailReclamationComponent },
      { path: 'reclamations/edit/:id', component: EditReclamationComponent },
      {
        path: 'boite-reception',
        loadComponent: () => import('./features/boite-reception').then(m => m.BoiteReceptionComponent)
      }
    ] 
  },
];
