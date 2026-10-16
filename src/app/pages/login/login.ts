import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COMPTES_INITIAUX } from '../../data/donnees-initiales';
import { MaterielStore } from '../materiels/materiel.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected readonly comptes = COMPTES_INITIAUX;
  private readonly store = inject(MaterielStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected connecter(compteId: number): void {
    if (!this.store.login(compteId)) {
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const destination = returnUrl && this.isAllowedReturnUrl(returnUrl) ? returnUrl : '/catalogue';
    void this.router.navigateByUrl(destination, { replaceUrl: true });
  }

  private isAllowedReturnUrl(url: string): boolean {
    return /^\/(?:catalogue|materiels\/\d+|mes-reservations|materiels-reservations|gestion(?:\/nouveau|\/\d+\/modifier)?)(?:[?#][^\s]*)?$/.test(
      url,
    );
  }
}
