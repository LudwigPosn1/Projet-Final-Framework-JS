import { TestBed } from '@angular/core/testing';
import { MaterielStore } from './materiel.store';

describe('MaterielStore', () => {
  let store: MaterielStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(MaterielStore);
  });

  it('allows a student to reserve available equipment only once', () => {
    expect(store.login(1)).toBe(true);
    expect(store.reserverEquipement(101, 1)).toBe(true);
    expect(store.reserverEquipement(101, 1)).toBe(false);
    expect(store.isReserved(101)).toBe(true);
  });

  it('does not allow a manager to reserve equipment', () => {
    expect(store.login(3)).toBe(true);
    expect(store.reserverEquipement(101, 3)).toBe(false);
    expect(store.isReserved(101)).toBe(false);
  });

  it('keeps reserved equipment until its reservation is cancelled', () => {
    store.login(1);
    expect(store.reserverEquipement(101, 1)).toBe(true);
    expect(store.removeEquipement(101)).toBe(false);

    const reservation = store.reservations()[0];
    expect(reservation).toBeDefined();
    expect(store.annulerReservation(reservation.id)).toBe(true);
    expect(store.removeEquipement(101)).toBe(false);
    expect(store.login(3)).toBe(true);
    expect(store.removeEquipement(101)).toBe(true);
  });

  it('requires the manager role and valid fields to manage equipment', () => {
    expect(
      store.addEquipement({
        nom: 'Clavier',
        categorie: 'Informatique',
        description: 'Un clavier de test.',
        localisation: 'Salle B201',
      }),
    ).toBe(false);

    expect(store.login(3)).toBe(true);
    expect(
      store.addEquipement({
        nom: 'PC',
        categorie: 'Informatique',
        description: 'Description suffisamment longue.',
        localisation: 'Salle B201',
      }),
    ).toBe(false);
    expect(
      store.addEquipement({
        nom: 'Clavier de prêt',
        categorie: 'Informatique',
        description: 'Un clavier de test avec son câble USB.',
        localisation: 'Salle B201',
      }),
    ).toBe(true);
  });

  it('rejects reservations for an unknown user or equipment', () => {
    store.login(1);
    expect(store.reserverEquipement(999, 1)).toBe(false);
    expect(store.reserverEquipement(101, 999)).toBe(false);
  });
});
