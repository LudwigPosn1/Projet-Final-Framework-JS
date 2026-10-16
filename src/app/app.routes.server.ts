import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'catalogue',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestion',
    renderMode: RenderMode.Client,
  },
  {
    path: 'materiels/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'materiels-reservations',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mes-reservations',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestion/nouveau',
    renderMode: RenderMode.Client,
  },
  {
    path: 'gestion/:id/modifier',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
