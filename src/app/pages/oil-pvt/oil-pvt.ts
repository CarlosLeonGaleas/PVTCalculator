import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalInputDirective, parseDecimalInput } from '../../directives/decimal-input.directive';
import {
  OilPvtService,
  OilPvtResults
} from '../../services/oil-pvt.service';

@Component({
  selector: 'app-oil-pvt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalInputDirective],
  templateUrl: './oil-pvt.html',
  styleUrl: './oil-pvt.css'
})
export class OilPvtComponent implements OnInit {
  protected readonly pageTitle = 'TERMODINÁMICA Y REOLOGÍA DEL PETRÓLEO';
  protected readonly imagePath = 'assets/modules/oil.svg';

  // Form input model (10 operational variables, string or number for comma decimal support)
  public inputs: any = {
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
    const parsedInputs = {
      temperature: parseDecimalInput(this.inputs.temperature),
      pressure: parseDecimalInput(this.inputs.pressure),
      gasInSolution: parseDecimalInput(this.inputs.gasInSolution),
      gasGravity: parseDecimalInput(this.inputs.gasGravity),
      apiGravity: parseDecimalInput(this.inputs.apiGravity),
      oilSpecificGravity: parseDecimalInput(this.inputs.oilSpecificGravity),
      gasVolumeY: parseDecimalInput(this.inputs.gasVolumeY),
      gasVolumeCS: parseDecimalInput(this.inputs.gasVolumeCS),
      shearStress: parseDecimalInput(this.inputs.shearStress),
      velocityGradient: parseDecimalInput(this.inputs.velocityGradient)
    };
    this.results = this.oilPvtService.calculate(parsedInputs);
  }

  /**
   * Loads sample operational values requested by user.
   */
  public loadSampleData(): void {
    this.inputs = {
      temperature: '180',
      pressure: '2500',
      gasInSolution: '500',
      gasGravity: '0,8',
      apiGravity: '28',
      oilSpecificGravity: '0,85',
      gasVolumeY: '1000',
      gasVolumeCS: '8000',
      shearStress: '8',
      velocityGradient: '4'
    };
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
   * Formats numbers to localized string using comma for decimals.
   */
  public formatNumber(value: number | null, decimals: number = 4): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toFixed(decimals).replace('.', ',');
  }

  /**
   * Formats number in scientific notation with comma.
   */
  public formatScientific(value: number | null): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toExponential(4).replace('.', ',');
  }

  /**
   * Formats constants replacing dot with comma.
   */
  public formatConstant(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '--';
    }
    return String(value).replace('.', ',');
  }

  /**
   * Checks if valid results exist.
   */
  public get hasValidResults(): boolean {
    return Object.values(this.results).some((val) => val !== null && typeof val !== 'object');
  }
}
