import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterielStore } from './materiel.store';

@Component({
  selector: 'app-materiels-details',
  imports: [RouterLink],
  templateUrl: './materiels-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterielsDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(MaterielStore);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  protected readonly message = signal('');

  protected readonly equipement = computed(() => {
    const id = Number(this.params().get('id'));
    return Number.isFinite(id)
      ? (this.store.equipements().find((item) => item.id === id) ?? null)
      : null;
  });

  protected reserver(): void {
    const equipement = this.equipement();
    const compte = this.store.currentUser();
    if (!equipement || !compte) {
      this.message.set('Connectez-vous pour réserver du matériel.');
      return;
    }

    this.message.set(
      this.store.reserverEquipement(equipement.id, compte.id)
        ? 'Votre réservation est confirmée.'
        : 'Ce matériel n’est plus disponible ou votre compte ne peut pas le réserver.',
    );
  }
}
