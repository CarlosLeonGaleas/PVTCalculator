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
      subtitle: 'DINÁMICA DE LA ROCA YACIMIENTO (NEWMAN)',
      path: '/rock-compressibility',
      image: '/assets/modules/rock.svg',
      icon: 'pi pi-database',
      badge: 'Newman Correlation',
      badgeColor: 'bg-[#ff8000]/10 text-[#ff8000] border-[#ff8000]/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
      description: 'Cálculo de compresibilidad de formación (Cf) basada en la porosidad de la roca yacimiento.'
    },
    {
      title: 'PVT Petróleo',
      subtitle: 'TERMODINÁMICA DEL PETRÓLEO (VASQUEZ-BEGGS)',
      path: '/oil-pvt',
      image: '/assets/modules/oil.svg',
      icon: 'pi pi-filter',
      badge: 'Vasquez-Beggs',
      badgeColor: 'bg-[#27348b]/10 text-[#27348b] border-[#27348b]/30 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
      description: 'Presión de burbuja (Pb), Razón Gas-Petróleo (Rs) y Factor Volumétrico (Bo).'
    },
    {
      title: 'PVT Agua (Osif)',
      subtitle: 'COMPRESIBILIDAD DEL AGUA DE ALTA SALINIDAD (OSIF, 1988)',
      path: '/water-pvt',
      image: '/assets/modules/water.svg',
      icon: 'pi pi-sun',
      badge: 'Osif (1988)',
      badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
      description: 'Compresibilidad del agua de formación salina (Cw) bajo altas presiones y salinidad.'
    },
    {
      title: 'Completación y Workover',
      subtitle: 'HIDROSTÁTICA Y FLUIDOS DE COMPLETACIÓN',
      path: '/completion-workover',
      image: '/assets/modules/completion.svg',
      icon: 'pi pi-cog',
      badge: 'Hidrostática',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      description: 'Presión hidrostática en el pozo, densidades de salmuera y operaciones de completación.'
    }
  ];
}
