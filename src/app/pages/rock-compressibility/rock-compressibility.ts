import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rock-compressibility',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rock-compressibility.html',
  styleUrl: './rock-compressibility.css'
})
export class RockCompressibilityComponent {
  protected readonly pageTitle = 'DINÁMICA DE LA ROCA YACIMIENTO (NEWMAN)';
  protected readonly imagePath = '/assets/modules/rock.svg';
}
