import { Injectable } from '@angular/core';

export type LithologyType = 'sandstone' | 'limestone';

export interface PoreCompressibilityInputs {
  effectivePorosity: number | null; // φ (fraction, e.g. 0.2)
  lithology: LithologyType; // 'sandstone' | 'limestone'
}

export interface FluidCompressibilityInputs {
  initialVolume: number | null; // Vi (cm³)
  volumeChange: number | null; // ΔV (cm³)
  pressureChange: number | null; // ΔP (psi)
}

export interface NewmanConstants {
  a: number;
  b: number;
  c: number;
  label: string;
}

export interface RockCompressibilityResults {
  poreCompressibility: number | null; // Cf (psi⁻¹)
  fluidCompressibility: number | null; // Cfluid (psi⁻¹)
  constants: NewmanConstants | null;
}

@Injectable({
  providedIn: 'root'
})
export class RockCompressibilityService {

  /**
   * Retrieves Newman empirical constants based on lithology.
   * Sandstone: a = 0.00009732, b = 0.699993, c = 79.8181
   * Limestone: a = 0.8535, b = 1.075, c = 2202000
   */
  getNewmanConstants(lithology: LithologyType): NewmanConstants {
    if (lithology === 'limestone') {
      return {
        a: 0.8535,
        b: 1.075,
        c: 2202000,
        label: 'Calizas (Carbonatos)'
      };
    }

    // Default: Sandstone
    return {
      a: 0.00009732,
      b: 0.699993,
      c: 79.8181,
      label: 'Areniscas Consolidadas'
    };
  }

  /**
   * Calculates Pore Volume Compressibility (Cf) using Newman correlation.
   * Formula: Cf = (a / (1 + b * φ)^c) * 10^-6 [psi⁻¹]
   */
  calculatePoreCompressibility(inputs: PoreCompressibilityInputs): { cf: number | null; constants: NewmanConstants } {
    const { effectivePorosity, lithology } = inputs;
    const constants = this.getNewmanConstants(lithology);

    const isValid = (val: number | null | undefined): val is number => {
      return val !== null && val !== undefined && !isNaN(val) && isFinite(val);
    };

    if (!isValid(effectivePorosity)) {
      return { cf: null, constants };
    }

    const base = 1 + constants.b * effectivePorosity;
    if (base === 0) {
      return { cf: null, constants };
    }

    const denominator = Math.pow(base, constants.c);
    if (denominator === 0 || !isFinite(denominator)) {
      return { cf: null, constants };
    }

    const cf = (constants.a / denominator) * 1e-6;
    return { cf: isFinite(cf) ? cf : null, constants };
  }

  /**
   * Calculates Fluid Compressibility (Cfluid).
   * Formula: Cfluid = -(1 / Vi) * (ΔV / ΔP) [psi⁻¹]
   */
  calculateFluidCompressibility(inputs: FluidCompressibilityInputs): number | null {
    const { initialVolume, volumeChange, pressureChange } = inputs;

    const isValid = (val: number | null | undefined): val is number => {
      return val !== null && val !== undefined && !isNaN(val) && isFinite(val);
    };

    if (!isValid(initialVolume) || !isValid(volumeChange) || !isValid(pressureChange)) {
      return null;
    }

    if (initialVolume === 0 || pressureChange === 0) {
      return null;
    }

    const cfluid = -(1 / initialVolume) * (volumeChange / pressureChange);
    return isFinite(cfluid) ? cfluid : null;
  }

  /**
   * Sample data for Pore Volume Compressibility mode.
   */
  getSamplePoreInputs(): PoreCompressibilityInputs {
    return {
      effectivePorosity: 0.2, // fraction
      lithology: 'sandstone'
    };
  }

  /**
   * Sample data for Fluid Compressibility mode.
   */
  getSampleFluidInputs(): FluidCompressibilityInputs {
    return {
      initialVolume: 100, // cm³
      volumeChange: -2, // cm³
      pressureChange: 500 // psi
    };
  }
}
