import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  AirportsComponent, PilotsComponent, AirplanesComponent,
  AirportUpdateComponent, TabsComponent, PilotUpdateComponent, AirplaneUpdateComponent
} from './components';
import { InMemoryDataService, AirportsService, PilotsService, AirplanesService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    AirportsComponent,
    PilotsComponent,
    AirplanesComponent,
    AirportUpdateComponent,
    TabsComponent,
    PilotUpdateComponent,
    AirplaneUpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule
  ],
  providers: [
    AirportsService,
    PilotsService,
    AirplanesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
