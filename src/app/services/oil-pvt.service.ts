import { Injectable } from '@angular/core';

export interface OilPvtInputs {
  temperature: number | null; // T (°F)
  pressure: number | null; // P (psi)
  gasInSolution: number | null; // Rs (scf/STB)
  gasGravity: number | null; // γg (adim)
  apiGravity: number | null; // API (°API)
  oilSpecificGravity: number | null; // γo (adim)
  gasVolumeY: number | null; // Vgas,Y (ft³)
  gasVolumeCS: number | null; // Vgas,CS (ft³)
  shearStress: number | null; // τ (Pa)
  velocityGradient: number | null; // du/dy (s⁻¹)
}

export interface OilConstants {
  c1: number;
  c2: number;
  c3: number;
  classification: string;
}

export interface OilPvtResults {
  bo: number | null; // Oil Formation Volume Factor (bbl/STB)
  co: number | null; // Oil Compressibility (psi⁻¹)
  bg: number | null; // Gas Formation Volume Factor (scf/STB)
  viscosity: number | null; // Dynamic Viscosity (Pa·s)
  calculatedApi: number | null; // Calculated API Gravity (°API)
  constants: OilConstants | null;
}

@Injectable({
  providedIn: 'root'
})
export class OilPvtService {

  /**
   * Evaluates constants C1, C2, C3 based on user API gravity input.
   * API <= 30 => Heavy/Medium Oil
   * API > 30 => Light Oil
   */
  getConstants(apiGravity: number | null): OilConstants | null {
    if (apiGravity === null || apiGravity === undefined || isNaN(apiGravity) || !isFinite(apiGravity)) {
      return null;
    }

    if (apiGravity <= 30) {
      return {
        c1: 0.0004677,
        c2: 0.00001751,
        c3: -1.811e-8,
        classification: 'Petróleo Pesado / Medio (API ≤ 30°)'
      };
    } else {
      return {
        c1: 0.000467,
        c2: 0.000011,
        c3: 1.337e-9,
        classification: 'Petróleo Liviano (API > 30°)'
      };
    }
  }

  /**
   * Performs all 5 Oil PVT calculations and constant selections.
   */
  calculate(inputs: OilPvtInputs): OilPvtResults {
    const {
      temperature,
      pressure,
      gasInSolution,
      gasGravity,
      apiGravity,
      oilSpecificGravity,
      gasVolumeY,
      gasVolumeCS,
      shearStress,
      velocityGradient
    } = inputs;

    const isValid = (val: number | null | undefined): val is number => {
      return val !== null && val !== undefined && !isNaN(val) && isFinite(val);
    };

    const constants = this.getConstants(apiGravity);

    // 1. Oil Formation Volume Factor (Bo) [bbl/STB]
    // Formula: 1 + C1*Rs + C2*(T-60)*(API/γg) + C3*Rs*(T-60)*(API/γg)
    let bo: number | null = null;
    if (
      constants !== null &&
      isValid(gasInSolution) &&
      isValid(temperature) &&
      isValid(apiGravity) &&
      isValid(gasGravity) &&
      gasGravity !== 0
    ) {
      const tempDiff = temperature - 60;
      const apiToGasGravityRatio = apiGravity / gasGravity;
      bo = 1 + constants.c1 * gasInSolution + constants.c2 * tempDiff * apiToGasGravityRatio + constants.c3 * gasInSolution * tempDiff * apiToGasGravityRatio;
    }

    // 2. Oil Compressibility (co) [psi⁻¹]
    // Formula: (-1433 + 5*Rs + 17.2*T - 1180*γg + 12.61*API) / (100000 * P)
    let co: number | null = null;
    if (
      isValid(gasInSolution) &&
      isValid(temperature) &&
      isValid(gasGravity) &&
      isValid(apiGravity) &&
      isValid(pressure) &&
      pressure !== 0
    ) {
      const numerator = -1433 + 5 * gasInSolution + 17.2 * temperature - 1180 * gasGravity + 12.61 * apiGravity;
      const denominator = 100000 * pressure;
      co = numerator / denominator;
    }

    // 3. Gas Formation Volume Factor (Bg) [scf/STB]
    // Formula: Vgas_Y / Vgas_CS
    let bg: number | null = null;
    if (isValid(gasVolumeY) && isValid(gasVolumeCS) && gasVolumeCS !== 0) {
      bg = gasVolumeY / gasVolumeCS;
    }

    // 4. Dynamic Viscosity (μ) [Pa·s]
    // Formula: τ / (du/dy)
    let viscosity: number | null = null;
    if (isValid(shearStress) && isValid(velocityGradient) && velocityGradient !== 0) {
      viscosity = shearStress / velocityGradient;
    }

    // 5. Calculated API Gravity (°API)
    // Formula: (141.5 / γo) - 131.5
    let calculatedApi: number | null = null;
    if (isValid(oilSpecificGravity) && oilSpecificGravity !== 0) {
      calculatedApi = (141.5 / oilSpecificGravity) - 131.5;
    }

    return {
      bo,
      co,
      bg,
      viscosity,
      calculatedApi,
      constants
    };
  }

  /**
   * Provides realistic sample input parameters for oil PVT calculations.
   */
  getSampleInputs(): OilPvtInputs {
    return {
      temperature: 180, // °F
      pressure: 2500, // psi
      gasInSolution: 500, // scf/STB
      gasGravity: 0.8, // adim
      apiGravity: 28, // °API
      oilSpecificGravity: 0.85, // adim
      gasVolumeY: 1000, // ft³
      gasVolumeCS: 8000, // ft³
      shearStress: 8, // Pa
      velocityGradient: 4 // s⁻¹
    };
  }
}
