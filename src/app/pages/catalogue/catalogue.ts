import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES, type Categorie } from '../../data/donnees-initiales';
import { CarteEquipementComponent } from './carte-equipement';
import { MaterielStore } from '../materiels/materiel.store';

@Component({
  selector: 'app-catalogue',
  imports: [RouterLink, CarteEquipementComponent],
  templateUrl: './catalogue.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueComponent {
  protected readonly categories = CATEGORIES;
  protected readonly recherche = signal('');
  protected readonly categorieSelectionnee = signal<Categorie | ''>('');
  protected readonly message = signal('');
  protected readonly store = inject(MaterielStore);
  private readonly router = inject(Router);

  protected readonly equipementsFiltres = computed(() => {
    const recherche = this.recherche().trim().toLocaleLowerCase('fr');
    const categorie = this.categorieSelectionnee();

    return this.store.equipements().filter((equipement) => {
      const correspondAuTexte =
        !recherche || equipement.nom.toLocaleLowerCase('fr').includes(recherche);
      return correspondAuTexte && (!categorie || equipement.categorie === categorie);
    });
  });

  protected onRechercheChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.recherche.set(event.target.value);
    }
  }

  protected onCategorieChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      const selectedCategory = this.categories.find((categorie) => target.value === categorie);
      this.categorieSelectionnee.set(selectedCategory ?? '');
    }
  }

  protected supprimer(equipementId: number): void {
    const equipement = this.store.equipements().find((item) => item.id === equipementId);
    if (
      !equipement ||
      typeof window === 'undefined' ||
      !window.confirm(`Supprimer « ${equipement.nom} » du catalogue ?`)
    ) {
      return;
    }

    const deleted = this.store.removeEquipement(equipementId);
    this.message.set(
      deleted
        ? 'Le matériel a été supprimé.'
        : 'Ce matériel est réservé ou n’existe plus : il ne peut pas être supprimé.',
    );
  }

  protected reserver(equipementId: number): void {
    const compte = this.store.currentUser();
    if (compte?.role !== 'student') {
      this.message.set('Connectez-vous avec un compte étudiant pour réserver ce matériel.');
      return;
    }

    if (!this.store.reserverEquipement(equipementId, compte.id)) {
      this.message.set('Ce matériel n’est plus disponible. Actualisez le catalogue et réessayez.');
      return;
    }

    this.message.set('Réservation confirmée. Retrouvez-la dans « Mes réservations ».');
  }
}
