import { inject } from '@angular/core';
import { CanActivateFn, Router, type UrlTree } from '@angular/router';
import { MaterielStore } from '../pages/materiels/materiel.store';

export const authGuard: CanActivateFn = async (_, state) => {
  const store = inject(MaterielStore);
  const router = inject(Router);
  await store.ensureInitialized();

  return store.currentUser()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
};

export const managerGuard: CanActivateFn = async (_, state) => {
  const store = inject(MaterielStore);
  const router = inject(Router);
  return requireRole(store, router, 'manager', state.url);
};

export const studentGuard: CanActivateFn = async (_, state) => {
  const store = inject(MaterielStore);
  const router = inject(Router);
  return requireRole(store, router, 'student', state.url);
};

export const homeGuard: CanActivateFn = async () => {
  const store = inject(MaterielStore);
  const router = inject(Router);
  await store.ensureInitialized();
  return router.createUrlTree([store.currentUser() ? '/catalogue' : '/login']);
};

async function requireRole(
  store: MaterielStore,
  router: Router,
  role: 'student' | 'manager',
  returnUrl: string,
): Promise<true | UrlTree> {
  await store.ensureInitialized();
  const user = store.currentUser();

  if (!user) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl },
    });
  }

  return user.role === role ? true : router.createUrlTree(['/acces-refuse']);
}
