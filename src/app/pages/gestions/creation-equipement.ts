import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { Equipement } from '../../data/donnees-initiales';
import { MaterielStore } from '../materiels/materiel.store';
import { FormulaireEquipementComponent } from './formulaire-equipement';

@Component({
  selector: 'app-creation-equipement',
  imports: [FormulaireEquipementComponent],
  templateUrl: './creation-equipement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreationEquipementComponent {
  protected readonly message = signal('');
  private readonly store = inject(MaterielStore);
  private readonly router = inject(Router);

  protected enregistrer(equipement: Omit<Equipement, 'id'>): void {
    if (!this.store.addEquipement(equipement)) {
      this.message.set('Le matériel n’a pas pu être ajouté. Vérifiez votre accès et réessayez.');
      return;
    }

    void this.router.navigateByUrl('/gestion');
  }
}
