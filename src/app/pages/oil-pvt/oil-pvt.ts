import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-oil-pvt',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './oil-pvt.html',
  styleUrl: './oil-pvt.css'
})
export class OilPvtComponent {
  protected readonly pageTitle = 'TERMODINÁMICA DEL PETRÓLEO (VASQUEZ-BEGGS)';
  protected readonly imagePath = '/assets/modules/oil.svg';
}
