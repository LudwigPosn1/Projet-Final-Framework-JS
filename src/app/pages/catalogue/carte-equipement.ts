import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Equipement } from '../../data/donnees-initiales';

@Component({
  selector: 'app-carte-equipement',
  imports: [RouterLink],
  templateUrl: './carte-equipement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarteEquipementComponent {
  readonly equipement = input.required<Equipement>();
  readonly reserve = input.required<boolean>();
  readonly gestionnaire = input.required<boolean>();
  readonly etudiant = input.required<boolean>();
  readonly suppressionDemandee = output<number>();
  readonly reservationDemandee = output<number>();
}
