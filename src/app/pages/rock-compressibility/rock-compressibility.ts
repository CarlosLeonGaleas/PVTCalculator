import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  RockCompressibilityService,
  LithologyType,
  PoreCompressibilityInputs,
  FluidCompressibilityInputs,
  NewmanConstants
} from '../../services/rock-compressibility.service';

@Component({
  selector: 'app-rock-compressibility',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rock-compressibility.html',
  styleUrl: './rock-compressibility.css'
})
export class RockCompressibilityComponent implements OnInit {
  protected readonly pageTitle = 'COMPRESIBILIDAD DE ROCA Y FLUIDO';
  protected readonly imagePath = '/assets/modules/rock.svg';

  // Active Sub-mode tab ('pore' | 'fluid')
  public activeTab: 'pore' | 'fluid' = 'pore';

  // Form input models
  public poreInputs: PoreCompressibilityInputs = {
    effectivePorosity: null,
    lithology: 'sandstone'
  };

  public fluidInputs: FluidCompressibilityInputs = {
    initialVolume: null,
    volumeChange: null,
    pressureChange: null
  };

  // Calculation results
  public poreResult: number | null = null;
  public fluidResult: number | null = null;
  public currentConstants: NewmanConstants | null = null;

  constructor(private readonly rockCompressibilityService: RockCompressibilityService) {}

  ngOnInit(): void {
    // Start with clean empty forms
    this.clearForm();
  }

  /**
   * Switches active sub-mode tab.
   */
  public selectTab(tab: 'pore' | 'fluid'): void {
    this.activeTab = tab;
    this.onInputChange();
  }

  /**
   * Triggers real-time calculation based on active tab.
   */
  public onInputChange(): void {
    if (this.activeTab === 'pore') {
      const { cf, constants } = this.rockCompressibilityService.calculatePoreCompressibility(this.poreInputs);
      this.poreResult = cf;
      this.currentConstants = constants;
    } else {
      this.fluidResult = this.rockCompressibilityService.calculateFluidCompressibility(this.fluidInputs);
    }
  }

  /**
   * Loads sample data for active tab.
   */
  public loadSampleData(): void {
    if (this.activeTab === 'pore') {
      this.poreInputs = this.rockCompressibilityService.getSamplePoreInputs();
    } else {
      this.fluidInputs = this.rockCompressibilityService.getSampleFluidInputs();
    }
    this.onInputChange();
  }

  /**
   * Resets active form inputs and clears results.
   */
  public clearForm(): void {
    if (this.activeTab === 'pore') {
      this.poreInputs = {
        effectivePorosity: null,
        lithology: 'sandstone'
      };
      this.poreResult = null;
      this.currentConstants = this.rockCompressibilityService.getNewmanConstants('sandstone');
    } else {
      this.fluidInputs = {
        initialVolume: null,
        volumeChange: null,
        pressureChange: null
      };
      this.fluidResult = null;
    }
    this.onInputChange();
  }

  /**
   * Subtitle indicating required input records count.
   */
  public get activeInputCountSubtitle(): string {
    return this.activeTab === 'pore'
      ? '1 dato de entrada requerido (Porosidad) y litología'
      : '3 datos de entrada requeridos (Vi, ΔV, ΔP)';
  }

  /**
   * Helper title for input toolbar.
   */
  public get activeSubmodeTitle(): string {
    return this.activeTab === 'pore'
      ? 'Compresibilidad de Poro (Cf)'
      : 'Compresibilidad del Fluido (Cfluido)';
  }

  /**
   * Helper subtitle for results card.
   */
  public get activeResultSubtitle(): string {
    return this.activeTab === 'pore'
      ? 'Correlación de Newman'
      : 'Ensayos P-V de Laboratorio';
  }

  /**
   * Formats numbers in scientific notation.
   */
  public formatScientific(value: number | null): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toExponential(4);
  }

  /**
   * Formats numbers in decimal notation.
   */
  public formatDecimal(value: number | null, decimals: number = 8): string {
    if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
      return '--';
    }
    return value.toFixed(decimals);
  }

  /**
   * Checks if active calculation mode has valid result.
   */
  public get hasValidResults(): boolean {
    if (this.activeTab === 'pore') {
      return this.poreResult !== null && !isNaN(this.poreResult) && isFinite(this.poreResult);
    } else {
      return this.fluidResult !== null && !isNaN(this.fluidResult) && isFinite(this.fluidResult);
    }
  }
}
