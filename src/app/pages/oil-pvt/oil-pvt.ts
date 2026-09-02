import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OilPvtService,
  OilPvtInputs,
  OilPvtResults
} from '../../services/oil-pvt.service';

@Component({
  selector: 'app-oil-pvt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './oil-pvt.html',
  styleUrl: './oil-pvt.css'
})
export class OilPvtComponent implements OnInit {
  protected readonly pageTitle = 'TERMODINÁMICA Y REOLOGÍA DEL PETRÓLEO';
  protected readonly imagePath = '/assets/modules/oil.svg';

  // Form input model (10 operational variables)
  public inputs: OilPvtInputs = {
    temperature: null,
    pressure: null,
    gasInSolution: null,
    gasGravity: null,
    apiGravity: null,
    oilSpecificGravity: null,
    gasVolumeY: null,
    gasVolumeCS: null,
    shearStress: null,
    velocityGradient: null
  };

  // Calculation results model (5 calculated metrics + constants)
  public results: OilPvtResults = {
    bo: null,
    co: null,
    bg: null,
    viscosity: null,
    calculatedApi: null,
    constants: null
  };

  constructor(private readonly oilPvtService: OilPvtService) {}

  ngOnInit(): void {
    // Start with a clean empty form
    this.clearForm();
  }

  /**
   * Triggers real-time calculation of oil PVT metrics and dynamic constants.
   */
  public onInputChange(): void {
    this.results = this.oilPvtService.calculate(this.inputs);
  }

  /**
   * Loads sample operational values requested by user.
   */
  public loadSampleData(): void {
    this.inputs = this.oilPvtService.getSampleInputs();
    this.onInputChange();
  }

  /**
   * Resets all input fields and clears computed results.
   */
  public clearForm(): void {
    this.inputs = {
      temperature: null,
      pressure: null,
      gasInSolution: null,
      gasGravity: null,
      apiGravity: null,
      oilSpecificGravity: null,
      gasVolumeY: null,
      gasVolumeCS: null,
      shearStress: null,
      velocityGradient: null
    };
    this.onInputChange();
  }

  /**
   * Formats numbers to localized string with fixed decimal places.
   */
  public formatNumber(value: number | null, decimals: number = 4): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Formats number in scientific notation.
   */
  public formatScientific(value: number | null): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toExponential(4);
  }

  /**
   * Checks if valid results exist.
   */
  public get hasValidResults(): boolean {
    return Object.values(this.results).some((val) => val !== null && typeof val !== 'object');
  }
}
