import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: '<p class="sr-only" role="status">Redirection vers votre espace…</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
