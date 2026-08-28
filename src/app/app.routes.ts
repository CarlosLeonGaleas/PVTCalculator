import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RockCompressibilityComponent } from './pages/rock-compressibility/rock-compressibility';
import { OilPvtComponent } from './pages/oil-pvt/oil-pvt';
import { WaterPvtComponent } from './pages/water-pvt/water-pvt';
import { CompletionWorkoverComponent } from './pages/completion-workover/completion-workover';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rock-compressibility', component: RockCompressibilityComponent },
  { path: 'oil-pvt', component: OilPvtComponent },
  { path: 'water-pvt', component: WaterPvtComponent },
  { path: 'completion-workover', component: CompletionWorkoverComponent },
  { path: '**', redirectTo: '' }
];
