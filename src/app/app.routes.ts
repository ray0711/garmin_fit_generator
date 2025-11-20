import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'exercises', pathMatch: 'full' },
  { path: 'exercises', children: [] },
  { path: 'workout', children: [] },
];
