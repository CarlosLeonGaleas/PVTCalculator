import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-water-pvt',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './water-pvt.html',
  styleUrl: './water-pvt.css'
})
export class WaterPvtComponent {
  protected readonly pageTitle = 'COMPRESIBILIDAD DEL AGUA DE ALTA SALINIDAD (OSIF, 1988)';
  protected readonly imagePath = '/assets/modules/water.svg';
}
