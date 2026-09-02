import { Injectable } from '@angular/core';

export interface WaterPvtInputs {
  pressure: number | null; // P in psia (Up to 20,000 psia)
  salinity: number | null; // S in ppm (NaCl)
  temperature: number | null; // T in °F (200 °F to 270 °F)
}

export interface WaterPvtResults {
  waterCompressibility: number | null; // cw in psi^-1
}

@Injectable({
  providedIn: 'root'
})
export class WaterPvtService {

  /**
   * Calculates formation water compressibility (cw) using Osif (1988) empirical correlation.
   * Formula: cw = 1 / (7033 * P + 0.5415 * S - 537.07 * T + 403300) [psi^-1]
   */
  calculate(inputs: WaterPvtInputs): WaterPvtResults {
    const { pressure, salinity, temperature } = inputs;

    const isValid = (val: number | null | undefined): val is number => {
      return val !== null && val !== undefined && !isNaN(val) && isFinite(val);
    };

    if (!isValid(pressure) || !isValid(salinity) || !isValid(temperature)) {
      return { waterCompressibility: null };
    }

    // Denominator calculation
    const denominator = 7.033 * pressure + 0.5415 * salinity - 537.07 * temperature + 403300;

    // Safety guard against division by zero
    if (denominator === 0) {
      return { waterCompressibility: null };
    }

    const waterCompressibility = 1 / denominator;

    return { waterCompressibility };
  }

  /**
   * Provides realistic sample data for water PVT calculation demonstration.
   */
  getSampleInputs(): WaterPvtInputs {
    return {
      pressure: 5000, // psia
      salinity: 80000, // ppm
      temperature: 220 // °F
    };
  }
}
