import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterielStore } from '../materiels/materiel.store';

@Component({
  selector: 'app-reservations',
  imports: [RouterLink],
  templateUrl: './reservations.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsComponent {
  protected readonly store = inject(MaterielStore);
  protected readonly lignes = computed(() => {
    const compteId = this.store.currentUser()?.id;
    return this.store
      .reservations()
      .filter((reservation) => reservation.etudiantId === compteId)
      .map((reservation) => ({
        reservation,
        equipement: this.store.equipements().find((item) => item.id === reservation.equipementId),
      }));
  });

  protected annuler(reservationId: string): void {
    this.store.annulerReservation(reservationId);
  }
}
