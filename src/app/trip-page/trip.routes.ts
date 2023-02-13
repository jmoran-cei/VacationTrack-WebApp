import { Routes } from '@angular/router';
import { TripOverviewComponent, TripToDoComponent, TripPhotosComponent } from '.';
import { EditTripComponent } from '../trips';
import { AuthGuard } from '../user';

export const tripRoutes: Routes = [
  { path: 'edit', component: EditTripComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    component: TripOverviewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'todo', component: TripToDoComponent, canActivate: [AuthGuard] },
  { path: 'photos', component: TripPhotosComponent, canActivate: [AuthGuard] },
];
