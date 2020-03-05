import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  TabsComponent, AirportsComponent, AirportUpdateComponent,
  PilotsComponent, PilotUpdateComponent, AirplanesComponent, AirplaneUpdateComponent
} from './components';

const appRoutes: Routes = [
  { path: '', component: TabsComponent, children: [
    { path: 'airports', component: AirportsComponent, children: [
      { path: ':id', component: AirportUpdateComponent }
    ] },
    { path: 'pilots', component: PilotsComponent, children: [
      { path: ':id', component: PilotUpdateComponent }
    ] },
    { path: 'airplanes', component: AirplanesComponent, children: [
      { path: ':id', component: AirplaneUpdateComponent }
    ] },
    { path: '', redirectTo: 'airports', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
