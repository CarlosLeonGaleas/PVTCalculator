import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CompletionWorkoverService,
  CompletionWorkoverInputs,
  CompletionWorkoverResults
} from '../../services/completion-workover.service';

@Component({
  selector: 'app-completion-workover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './completion-workover.html',
  styleUrl: './completion-workover.css'
})
export class CompletionWorkoverComponent implements OnInit {
  protected readonly pageTitle = 'COMPLETACIÓN Y WORKOVER';
  protected readonly imagePath = '/assets/modules/completion.svg';

  // Form input model (13 operational variables)
  public inputs: CompletionWorkoverInputs = {
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
    this.results = this.completionWorkoverService.calculate(this.inputs);
  }

  /**
   * Loads realistic sample operational parameters and calculates results.
   */
  public loadSampleData(): void {
    this.inputs = this.completionWorkoverService.getSampleInputs();
    this.onInputChange();
  }

  /**
   * Resets all input fields and cleared calculated results.
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
   * Formats numbers to string with specified decimal places.
   */
  public formatNumber(value: number | null, decimals: number = 2): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Checks if any valid result is currently computed.
   */
  public get hasValidResults(): boolean {
    return Object.values(this.results).some((val) => val !== null && !isNaN(val) && isFinite(val));
  }
}
