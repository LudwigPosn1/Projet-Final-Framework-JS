import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIES, type Equipement } from '../../data/donnees-initiales';

@Component({
  selector: 'app-formulaire-equipement',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulaire-equipement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulaireEquipementComponent {
  readonly equipement = input.required<Equipement | null>();
  readonly enregistrementDemande = output<Omit<Equipement, 'id'>>();

  protected readonly categories = CATEGORIES;
  protected readonly submitted = signal(false);
  protected readonly message = signal('');
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  protected readonly form = this.formBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
    categorie: [CATEGORIES[0], Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    localisation: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const equipement = this.equipement();
      this.form.reset({
        nom: equipement?.nom ?? '',
        categorie: equipement?.categorie ?? CATEGORIES[0],
        description: equipement?.description ?? '',
        localisation: equipement?.localisation ?? '',
      });
      this.submitted.set(false);
      this.message.set('');
    });
  }

  protected enregistrer(): void {
    this.submitted.set(true);
    const values = this.form.getRawValue();
    const nom = values.nom.trim();
    const description = values.description.trim();
    const localisation = values.localisation.trim();

    if (this.form.invalid || nom.length < 3 || description.length < 10 || !localisation) {
      this.message.set(
        'Corrigez les champs indiqués : nom de 3 caractères minimum, description de 10 caractères minimum et lieu obligatoire.',
      );
      this.form.markAllAsTouched();
      return;
    }

    this.message.set('');
    this.enregistrementDemande.emit({
      nom,
      categorie: values.categorie,
      description,
      localisation,
    });
  }
}
