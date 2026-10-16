import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterielStore } from './pages/materiels/materiel.store';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly store = inject(MaterielStore);
  protected readonly currentUser = this.store.currentUser;
  protected readonly storageMessage = this.store.storageMessage;
  private readonly router = inject(Router);

  protected logout(): void {
    this.store.logout();
    void this.router.navigateByUrl('/login');
  }
}
