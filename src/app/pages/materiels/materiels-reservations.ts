import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterielStore } from './materiel.store';

@Component({
  selector: 'app-materiels-reservations',
  imports: [RouterLink],
  templateUrl: './materiels-reservations.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterielsReservationsComponent {
  protected readonly store = inject(MaterielStore);
  protected readonly lignes = computed(() =>
    this.store.reservations().map((reservation) => ({
      reservation,
      equipement: this.store.equipements().find((item) => item.id === reservation.equipementId),
      compte: this.store.utilisateurs.find((item) => item.id === reservation.etudiantId),
    })),
  );

  protected annuler(reservationId: string): void {
    this.store.annulerReservation(reservationId);
  }
}
