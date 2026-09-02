import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ModuleCard {
  title: string;
  subtitle: string;
  path: string;
  image: string;
  icon: string;
  badge: string;
  badgeColor: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  protected readonly modules: ModuleCard[] = [
    {
      title: 'Compresibilidad Roca',
      subtitle: 'COMPRESIBILIDAD DE ROCA Y FLUIDO',
      path: '/rock-compressibility',
      image: '/assets/modules/rock.svg',
      icon: 'pi pi-database',
      badge: 'Newman & Fluido',
      badgeColor: 'bg-[#ff8000]/10 text-[#ff8000] border-[#ff8000]/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
      description: 'Estimación de la compresibilidad del volumen poroso (Cf) ajustada por Newman según litología y compresibilidad directa del fluido (Cfluido).'
    },
    {
      title: 'PVT Petróleo',
      subtitle: 'TERMODINÁMICA Y REOLOGÍA DEL PETRÓLEO',
      path: '/oil-pvt',
      image: '/assets/modules/oil.svg',
      icon: 'pi pi-filter',
      badge: 'Vasquez-Beggs & Reología',
      badgeColor: 'bg-[#27348b]/10 text-[#27348b] border-[#27348b]/30 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
      description: 'Estimación de propiedades PVT del crudo (Factor volumétrico Bo, Compresibilidad co, Factor gas Bg, Viscosidad μ y API) por Vasquez-Beggs y reología.'
    },
    {
      title: 'PVT Agua',
      subtitle: 'COMPRESIBILIDAD DEL AGUA SALINA (OSIF, 1988)',
      path: '/water-pvt',
      image: '/assets/modules/water.svg',
      icon: 'pi pi-sun',
      badge: 'Osif (1988)',
      badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
      description: 'Estimación de la compresibilidad del agua de formación salina (cw) bajo altas presiones utilizando la correlación empírica de Osif (1988).'
    },
    {
      title: 'Completación y Workover',
      subtitle: 'HIDROSTÁTICA Y CONTROL DE POZO',
      path: '/completion-workover',
      image: '/assets/modules/completion.svg',
      icon: 'pi pi-cog',
      badge: 'Hidrostática',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      description: 'Cálculo de parámetros operativos e indicadores de control de pozo para operaciones de completación y reacondicionamiento.'
    }
  ];
}
