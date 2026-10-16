import { Routes } from '@angular/router';
import { authGuard, homeGuard, managerGuard, studentGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [homeGuard],
    loadComponent: () => import('./pages/home/home').then((module) => module.HomeComponent),
  },
  {
    path: 'login',
    title: 'Connexion | Campus Matériel',
    loadComponent: () => import('./pages/login/login').then((module) => module.LoginComponent),
  },
  {
    path: 'acces-refuse',
    title: 'Accès refusé | Campus Matériel',
    loadComponent: () =>
      import('./pages/acces-refuse/acces-refuse').then((module) => module.AccesRefuseComponent),
  },
  {
    path: 'catalogue',
    canActivate: [authGuard],
    title: 'Catalogue | Campus Matériel',
    loadComponent: () =>
      import('./pages/catalogue/catalogue').then((module) => module.CatalogueComponent),
  },
  {
    path: 'gestion',
    canActivate: [authGuard, managerGuard],
    title: 'Gestion du catalogue | Campus Matériel',
    loadComponent: () =>
      import('./pages/catalogue/catalogue').then((module) => module.CatalogueComponent),
  },
  {
    path: 'materiels/:id',
    canActivate: [authGuard],
    title: 'Détail du matériel | Campus Matériel',
    loadComponent: () =>
      import('./pages/materiels/materiels-details').then(
        (module) => module.MaterielsDetailsComponent,
      ),
  },
  {
    path: 'materiels-reservations',
    canActivate: [authGuard, managerGuard],
    title: 'Toutes les réservations | Campus Matériel',
    loadComponent: () =>
      import('./pages/materiels/materiels-reservations').then(
        (module) => module.MaterielsReservationsComponent,
      ),
  },
  {
    path: 'mes-reservations',
    canActivate: [authGuard, studentGuard],
    title: 'Mes réservations | Campus Matériel',
    loadComponent: () =>
      import('./pages/reservations/reservations').then((module) => module.ReservationsComponent),
  },
  {
    path: 'gestion/nouveau',
    canActivate: [authGuard, managerGuard],
    title: 'Ajouter un équipement | Campus Matériel',
    loadComponent: () =>
      import('./pages/gestions/creation-equipement').then(
        (module) => module.CreationEquipementComponent,
      ),
  },
  {
    path: 'gestion/:id/modifier',
    canActivate: [authGuard, managerGuard],
    title: 'Modifier un équipement | Campus Matériel',
    loadComponent: () =>
      import('./pages/gestions/modification-equipement').then(
        (module) => module.ModificationEquipementComponent,
      ),
  },
  {
    path: '**',
    title: 'Page introuvable | Campus Matériel',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((module) => module.NotFoundComponent),
  },
];
