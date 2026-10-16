import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acces-refuse',
  imports: [RouterLink],
  templateUrl: './acces-refuse.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccesRefuseComponent {}
