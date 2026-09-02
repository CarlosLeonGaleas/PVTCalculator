import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalInputDirective, parseDecimalInput } from '../../directives/decimal-input.directive';
import {
  WaterPvtService,
  WaterPvtResults
} from '../../services/water-pvt.service';

@Component({
  selector: 'app-water-pvt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalInputDirective],
  templateUrl: './water-pvt.html',
  styleUrl: './water-pvt.css'
})
export class WaterPvtComponent implements OnInit {
  protected readonly pageTitle = 'COMPRESIBILIDAD DEL AGUA SALINA (OSIF, 1988)';
  protected readonly imagePath = '/assets/modules/water.svg';

  // Form input model (string or number for comma decimal support)
  public inputs: any = {
    pressure: null,
    salinity: null,
    temperature: null
  };

  // Calculation results model
  public results: WaterPvtResults = {
    waterCompressibility: null
  };

  constructor(private readonly waterPvtService: WaterPvtService) {}

  ngOnInit(): void {
    // Start with a clean empty form
    this.clearForm();
  }

  /**
   * Triggers real-time calculation of water compressibility.
   */
  public onInputChange(): void {
    const parsed = {
      pressure: parseDecimalInput(this.inputs.pressure),
      salinity: parseDecimalInput(this.inputs.salinity),
      temperature: parseDecimalInput(this.inputs.temperature)
    };
    this.results = this.waterPvtService.calculate(parsed);
  }

  /**
   * Loads sample operational values (P=5000 psia, S=80000 ppm, T=220 °F).
   */
  public loadSampleData(): void {
    this.inputs = {
      pressure: '5000',
      salinity: '80000',
      temperature: '220'
    };
    this.onInputChange();
  }

  /**
   * Resets all input fields and clears results.
   */
  public clearForm(): void {
    this.inputs = {
      pressure: null,
      salinity: null,
      temperature: null
    };
    this.onInputChange();
  }

  /**
   * Formats compressibility result in scientific notation with comma.
   */
  public formatScientific(value: number | null): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toExponential(4).replace('.', ',');
  }

  /**
   * Formats decimal representation of water compressibility with comma.
   */
  public formatDecimal(value: number | null): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toFixed(8).replace('.', ',');
  }

  /**
   * Checks if valid result is currently computed.
   */
  public get hasValidResults(): boolean {
    return this.results.waterCompressibility !== null && !isNaN(this.results.waterCompressibility);
  }
}
