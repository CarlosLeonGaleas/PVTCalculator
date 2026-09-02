import { Injectable } from '@angular/core';

export interface CompletionWorkoverInputs {
  fluidDensity: number | null; // MW (ppg)
  tvd: number | null; // True Vertical Depth (ft)
  annularPressureDrop: number | null; // ΔP (psi)
  steelDensity: number | null; // Steel Density (ppg)
  pwf: number | null; // Flowing Bottomhole Pressure (psi)
  surfacePressure: number | null; // Surface Pressure (psi)
  formationPressure: number | null; // Formation Pressure (psi)
  frictionPressure: number | null; // Friction Pressure (psi)
  capacity: number | null; // Capacity (bbl/ft)
  length: number | null; // Length (ft)
  time: number | null; // Time (hours)
  area: number | null; // Area (ft²)
  productionRate: number | null; // Production Rate (bpd)
}

export interface CompletionWorkoverResults {
  hydrostaticPressure: number | null; // Ph (psi)
  ecd: number | null; // Equivalent Circulating Density (ppg)
  buoyancyFactor: number | null; // BF (adim)
  requiredMudWeight: number | null; // MWreq (ppg)
  pressureGradient: number | null; // G (psi/ft)
  bhp: number | null; // Bottom Hole Pressure (psi)
  totalCirculationPressure: number | null; // Ptotal (psi)
  requiredVolume: number | null; // V (bbl)
  pumpingRate: number | null; // Q (bbl/h)
  displacedVolume: number | null; // Vd (ft³)
  productivityIndex: number | null; // IP (bpd/psi)
}

@Injectable({
  providedIn: 'root'
})
export class CompletionWorkoverService {

  /**
   * Performs all 11 completion & workover calculations based on 13 operational input parameters.
   * Includes safety guards against division by zero and null values.
   */
  calculate(inputs: CompletionWorkoverInputs): CompletionWorkoverResults {
    const {
      fluidDensity,
      tvd,
      annularPressureDrop,
      pwf,
      surfacePressure,
      formationPressure,
      frictionPressure,
      capacity,
      length,
      time,
      area,
      productionRate
    } = inputs;

    // Helper function to validate if a value is a valid finite number
    const isValid = (val: number | null | undefined): val is number => {
      return val !== null && val !== undefined && !isNaN(val) && isFinite(val);
    };

    // 1. Hydrostatic Pressure (Ph = 0.052 * MW * TVD) [psi]
    const hydrostaticPressure = (isValid(fluidDensity) && isValid(tvd))
      ? 0.052 * fluidDensity * tvd
      : null;

    // 2. Equivalent Circulating Density (ECD = MW + (ΔP / (0.052 * TVD))) [ppg]
    const ecd = (isValid(fluidDensity) && isValid(annularPressureDrop) && isValid(tvd) && tvd !== 0)
      ? fluidDensity + (annularPressureDrop / (0.052 * tvd))
      : null;

    // 3. Buoyancy Factor (BF = (65.4 - MW) / 65.4) [adim]
    const buoyancyFactor = isValid(fluidDensity)
      ? (65.4 - fluidDensity) / 65.4
      : null;

    // 4. Required Mud Weight (MWreq = Pf / (0.052 * TVD)) [ppg]
    const requiredMudWeight = (isValid(formationPressure) && isValid(tvd) && tvd !== 0)
      ? formationPressure / (0.052 * tvd)
      : null;

    // 5. Pressure Gradient (G = Pwf / TVD) [psi/ft]
    const pressureGradient = (isValid(pwf) && isValid(tvd) && tvd !== 0)
      ? pwf / tvd
      : null;

    // 6. Bottomhole Pressure (BHP = Ps + Ph) [psi]
    const bhp = (isValid(surfacePressure) && isValid(hydrostaticPressure))
      ? surfacePressure + hydrostaticPressure
      : null;

    // 7. Total Circulation Pressure (Ptotal = Ph + Pfr) [psi]
    const totalCirculationPressure = (isValid(hydrostaticPressure) && isValid(frictionPressure))
      ? hydrostaticPressure + frictionPressure
      : null;

    // 8. Required Fluid Volume (V = Cap * L) [bbl]
    const requiredVolume = (isValid(capacity) && isValid(length))
      ? capacity * length
      : null;

    // 9. Pumping Rate (Q = V / t) [bbl/h]
    const pumpingRate = (isValid(requiredVolume) && isValid(time) && time !== 0)
      ? requiredVolume / time
      : null;

    // 10. Displaced Volume (Vd = A * L) [ft³]
    const displacedVolume = (isValid(area) && isValid(length))
      ? area * length
      : null;

    // 11. Productivity Index (IP = q / (Pf - Pwf)) [bpd/psi]
    const drawdown = (isValid(formationPressure) && isValid(pwf)) ? formationPressure - pwf : null;
    const productivityIndex = (isValid(productionRate) && isValid(drawdown) && drawdown !== 0)
      ? productionRate / drawdown
      : null;

    return {
      hydrostaticPressure,
      ecd,
      buoyancyFactor,
      requiredMudWeight,
      pressureGradient,
      bhp,
      totalCirculationPressure,
      requiredVolume,
      pumpingRate,
      displacedVolume,
      productivityIndex
    };
  }

  /**
   * Provides realistic sample data for quick demonstration and testing.
   */
  getSampleInputs(): CompletionWorkoverInputs {
    return {
      fluidDensity: 11, // MW in ppg
      tvd: 8500, // TVD in ft
      annularPressureDrop: 250, // ΔP in psi
      steelDensity: 65.5, // Steel density in ppg
      pwf: 2800, // Pwf in psi
      surfacePressure: 500, // Ps in psi
      formationPressure: 4500, // Pf in psi
      frictionPressure: 300, // Pfr in psi
      capacity: 0.02, // Cap in bbl/ft
      length: 8000, // L in ft
      time: 4, // t in hours
      area: 2.5, // A in ft²
      productionRate: 600 // q in bpd
    };
  }
}
