import { afterNextRender, effect, Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CATEGORIES,
  COMPTES_INITIAUX,
  EQUIPEMENTS_INITIAUX,
  RESERVATIONS_INITIALES,
  type Compte,
  type Categorie,
  type Equipement,
  type Reservation,
} from '../../data/donnees-initiales';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCategorie(value: unknown): value is Categorie {
  return CATEGORIES.some((categorie) => categorie === value);
}

function isEquipement(value: unknown): value is Equipement {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    Number.isSafeInteger(value['id']) &&
    typeof value['nom'] === 'string' &&
    value['nom'].trim().length >= 3 &&
    isCategorie(value['categorie']) &&
    typeof value['description'] === 'string' &&
    value['description'].trim().length >= 10 &&
    typeof value['localisation'] === 'string' &&
    value['localisation'].trim().length > 0
  );
}

function isEquipementList(value: unknown): value is Equipement[] {
  return (
    Array.isArray(value) &&
    value.every(isEquipement) &&
    new Set(value.map((item: Equipement) => item.id)).size === value.length
  );
}

function isReservation(value: unknown): value is Reservation {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['equipementId'] === 'number' &&
    Number.isSafeInteger(value['equipementId']) &&
    typeof value['etudiantId'] === 'number' &&
    Number.isSafeInteger(value['etudiantId'])
  );
}

function isReservationList(value: unknown): value is Reservation[] {
  return (
    Array.isArray(value) &&
    value.every(isReservation) &&
    new Set(value.map((item: Reservation) => item.id)).size === value.length &&
    new Set(value.map((item: Reservation) => item.equipementId)).size === value.length
  );
}

function isCompte(value: unknown): value is Compte {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    Number.isSafeInteger(value['id']) &&
    typeof value['nom'] === 'string' &&
    COMPTES_INITIAUX.some(
      (compte) =>
        compte.id === value['id'] && compte.nom === value['nom'] && compte.role === value['role'],
    )
  );
}

function isCompteOrNull(value: unknown): value is Compte | null {
  return value === null || isCompte(value);
}

@Injectable({ providedIn: 'root' })
export class MaterielStore {
  private readonly equipementsState = signal(structuredClone(EQUIPEMENTS_INITIAUX));
  private readonly reservationsState = signal(structuredClone(RESERVATIONS_INITIALES));
  private readonly currentUserState = signal<Compte | null>(null);
  private readonly persistenceReady = signal(false);
  private readonly storageMessageState = signal('');
  private readonly initialization: Promise<void>;
  private hasWriteFailure = false;

  readonly equipements = this.equipementsState.asReadonly();
  readonly reservations = this.reservationsState.asReadonly();
  readonly currentUser = this.currentUserState.asReadonly();
  readonly utilisateurs = COMPTES_INITIAUX;
  readonly storageMessage = this.storageMessageState.asReadonly();

  constructor() {
    this.initialization = isPlatformBrowser(inject(PLATFORM_ID))
      ? new Promise<void>((resolve) => {
          afterNextRender(() => {
            const equipements = this.loadStorage(
              'campus_equipements',
              EQUIPEMENTS_INITIAUX,
              isEquipementList,
            );
            this.equipementsState.set(equipements);
            this.reservationsState.set(
              this.loadStorage(
                'campus_reservations',
                RESERVATIONS_INITIALES,
                (value): value is Reservation[] =>
                  isReservationList(value) &&
                  value.every(
                    (reservation) =>
                      equipements.some(
                        (equipement) => equipement.id === reservation.equipementId,
                      ) &&
                      COMPTES_INITIAUX.some(
                        (compte) =>
                          compte.id === reservation.etudiantId && compte.role === 'student',
                      ),
                  ),
              ),
            );
            this.currentUserState.set(
              this.loadStorage<Compte | null>('campus_current_user', null, isCompteOrNull),
            );
            this.persistenceReady.set(true);
            resolve();
          });
        })
      : Promise.resolve();

    effect(() => {
      if (typeof window === 'undefined' || !this.persistenceReady()) {
        return;
      }

      try {
        window.localStorage.setItem('campus_equipements', JSON.stringify(this.equipementsState()));
        window.localStorage.setItem(
          'campus_reservations',
          JSON.stringify(this.reservationsState()),
        );
        window.localStorage.setItem('campus_current_user', JSON.stringify(this.currentUserState()));
        if (this.hasWriteFailure) {
          this.hasWriteFailure = false;
          this.storageMessageState.set('');
        }
      } catch (error) {
        this.hasWriteFailure = true;
        this.storageMessageState.set(
          'Les modifications sont visibles, mais le navigateur n’a pas pu les enregistrer. Elles risquent de ne pas être conservées après fermeture.',
        );
        console.error('Impossible de sauvegarder les données locales.', error);
      }
    });
  }

  async ensureInitialized(): Promise<void> {
    await this.initialization;
  }

  private loadStorage<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
    if (typeof window === 'undefined') {
      return structuredClone(fallback);
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) {
        return structuredClone(fallback);
      }

      const parsed: unknown = JSON.parse(storedValue);
      if (!validate(parsed)) {
        this.storageMessageState.set(
          'Certaines données locales sont invalides. Les données de démonstration correspondantes sont utilisées.',
        );
        console.error(`Le format des données locales "${key}" est invalide.`);
        return structuredClone(fallback);
      }

      return parsed;
    } catch (error) {
      this.storageMessageState.set(
        'Le navigateur n’a pas pu lire les données locales. Les données de démonstration sont utilisées pour cette session.',
      );
      console.error(`Impossible de lire les données locales "${key}".`, error);
      return structuredClone(fallback);
    }
  }

  login(compteId: number): boolean {
    const compte = COMPTES_INITIAUX.find((item) => item.id === compteId);
    if (!compte) {
      return false;
    }

    this.currentUserState.set(structuredClone(compte));
    return true;
  }

  logout(): void {
    this.currentUserState.set(null);
  }

  isReserved(equipementId: number): boolean {
    return this.reservationsState().some(
      (reservation) => reservation.equipementId === equipementId,
    );
  }

  addEquipement(equipement: Omit<Equipement, 'id'>): boolean {
    if (
      this.currentUserState()?.role !== 'manager' ||
      !isCategorie(equipement.categorie) ||
      equipement.nom.trim().length < 3 ||
      equipement.description.trim().length < 10 ||
      !equipement.localisation.trim()
    ) {
      return false;
    }

    this.equipementsState.update((equipements) => {
      let id = Date.now();
      while (equipements.some((item) => item.id === id)) {
        id += 1;
      }

      return [...equipements, { ...structuredClone(equipement), id }];
    });
    return true;
  }

  updateEquipement(updated: Equipement): boolean {
    if (
      this.currentUserState()?.role !== 'manager' ||
      !isCategorie(updated.categorie) ||
      updated.nom.trim().length < 3 ||
      updated.description.trim().length < 10 ||
      !updated.localisation.trim()
    ) {
      return false;
    }

    let found = false;
    this.equipementsState.update((equipements) =>
      equipements.map((equipement) => {
        if (equipement.id !== updated.id) {
          return equipement;
        }

        found = true;
        return structuredClone(updated);
      }),
    );
    return found;
  }

  removeEquipement(id: number): boolean {
    if (this.currentUserState()?.role !== 'manager' || this.isReserved(id)) {
      return false;
    }

    const remaining = this.equipementsState().filter((equipement) => equipement.id !== id);
    if (remaining.length === this.equipementsState().length) {
      return false;
    }

    this.equipementsState.set(remaining);
    return true;
  }

  reserverEquipement(equipementId: number, etudiantId: number): boolean {
    const compte = this.currentUserState();
    const equipementExists = this.equipementsState().some(
      (equipement) => equipement.id === equipementId,
    );
    if (
      compte?.role !== 'student' ||
      compte.id !== etudiantId ||
      !equipementExists ||
      this.isReserved(equipementId)
    ) {
      return false;
    }

    this.reservationsState.update((reservations) => [
      ...reservations,
      {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        equipementId,
        etudiantId,
      },
    ]);
    return true;
  }

  annulerReservation(reservationId: string): boolean {
    const compte = this.currentUserState();
    const reservation = this.reservationsState().find((item) => item.id === reservationId);
    if (!reservation || (compte?.role !== 'manager' && reservation.etudiantId !== compte?.id)) {
      return false;
    }

    this.reservationsState.update((reservations) =>
      reservations.filter((item) => item.id !== reservationId),
    );
    return true;
  }
}
