import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalInputDirective, parseDecimalInput } from '../../directives/decimal-input.directive';
import {
  CompletionWorkoverService,
  CompletionWorkoverResults
} from '../../services/completion-workover.service';

@Component({
  selector: 'app-completion-workover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalInputDirective],
  templateUrl: './completion-workover.html',
  styleUrl: './completion-workover.css'
})
export class CompletionWorkoverComponent implements OnInit {
  protected readonly pageTitle = 'COMPLETACIÓN Y WORKOVER';
  protected readonly imagePath = '/assets/modules/completion.svg';

  // Form input model (13 operational variables, string or number for comma decimal support)
  public inputs: any = {
    fluidDensity: null,
    tvd: null,
    annularPressureDrop: null,
    steelDensity: null,
    pwf: null,
    surfacePressure: null,
    formationPressure: null,
    frictionPressure: null,
    capacity: null,
    length: null,
    time: null,
    area: null,
    productionRate: null
  };

  // Calculation results model (11 key indicators)
  public results: CompletionWorkoverResults = {
    hydrostaticPressure: null,
    ecd: null,
    buoyancyFactor: null,
    requiredMudWeight: null,
    pressureGradient: null,
    bhp: null,
    totalCirculationPressure: null,
    requiredVolume: null,
    pumpingRate: null,
    displacedVolume: null,
    productivityIndex: null
  };

  constructor(private readonly completionWorkoverService: CompletionWorkoverService) {}

  ngOnInit(): void {
    // Start with a clean empty form
    this.clearForm();
  }

  /**
   * Triggers real-time calculation of all 11 output metrics.
   */
  public onInputChange(): void {
    const parsedInputs = {
      fluidDensity: parseDecimalInput(this.inputs.fluidDensity),
      tvd: parseDecimalInput(this.inputs.tvd),
      annularPressureDrop: parseDecimalInput(this.inputs.annularPressureDrop),
      steelDensity: parseDecimalInput(this.inputs.steelDensity),
      pwf: parseDecimalInput(this.inputs.pwf),
      surfacePressure: parseDecimalInput(this.inputs.surfacePressure),
      formationPressure: parseDecimalInput(this.inputs.formationPressure),
      frictionPressure: parseDecimalInput(this.inputs.frictionPressure),
      capacity: parseDecimalInput(this.inputs.capacity),
      length: parseDecimalInput(this.inputs.length),
      time: parseDecimalInput(this.inputs.time),
      area: parseDecimalInput(this.inputs.area),
      productionRate: parseDecimalInput(this.inputs.productionRate)
    };
    this.results = this.completionWorkoverService.calculate(parsedInputs);
  }

  /**
   * Loads realistic sample operational parameters and calculates results.
   */
  public loadSampleData(): void {
    this.inputs = {
      fluidDensity: '11',
      tvd: '8500',
      annularPressureDrop: '250',
      steelDensity: '65,5',
      pwf: '2800',
      surfacePressure: '500',
      formationPressure: '4500',
      frictionPressure: '300',
      capacity: '0,02',
      length: '8000',
      time: '4',
      area: '2,5',
      productionRate: '600'
    };
    this.onInputChange();
  }

  /**
   * Resets all input fields and clears calculated results.
   */
  public clearForm(): void {
    this.inputs = {
      fluidDensity: null,
      tvd: null,
      annularPressureDrop: null,
      steelDensity: null,
      pwf: null,
      surfacePressure: null,
      formationPressure: null,
      frictionPressure: null,
      capacity: null,
      length: null,
      time: null,
      area: null,
      productionRate: null
    };
    this.onInputChange();
  }

  /**
   * Formats numbers to string with specified decimal places using comma.
   */
  public formatNumber(value: number | null, decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toFixed(decimals).replace('.', ',');
  }

  /**
   * Checks if any valid result is currently computed.
   */
  public get hasValidResults(): boolean {
    return Object.values(this.results).some((val) => val !== null && !isNaN(val) && isFinite(val));
  }
}
