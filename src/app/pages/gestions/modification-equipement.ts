import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { Equipement } from '../../data/donnees-initiales';
import { MaterielStore } from '../materiels/materiel.store';
import { FormulaireEquipementComponent } from './formulaire-equipement';

@Component({
  selector: 'app-modification-equipement',
  imports: [FormulaireEquipementComponent],
  templateUrl: './modification-equipement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificationEquipementComponent {
  protected readonly message = signal('');
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(MaterielStore);
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly equipement =
    this.store.equipements().find((item) => item.id === this.id) ?? null;

  constructor() {
    if (!this.equipement) {
      void this.router.navigateByUrl('/introuvable', { replaceUrl: true });
    }
  }

  protected enregistrer(changements: Omit<Equipement, 'id'>): void {
    if (!this.equipement) {
      this.message.set('Ce matériel n’existe plus.');
      return;
    }

    const updated = this.store.updateEquipement({
      ...this.equipement,
      ...changements,
    });
    if (!updated) {
      this.message.set('Le matériel n’a pas pu être modifié. Vérifiez votre accès et réessayez.');
      return;
    }

    void this.router.navigateByUrl('/gestion');
  }
}
