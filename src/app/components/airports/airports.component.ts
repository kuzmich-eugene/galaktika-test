import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IAirport, IAirplane, IPilot } from 'src/app/interfaces';
import { AirportsService, AirplanesService, PilotsService } from 'src/app/services';


@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.scss']
})
export class AirportsComponent implements OnInit, OnDestroy {
  public dataSource = new MatTableDataSource<IAirport>();
  public airportForm: FormGroup;
  public columns = ['airportCode', 'airportName', 'airportAddress'];
  public allAirplanes: IAirplane[];
  public allPilots: IPilot[];
  get formDisabled(): boolean {
    return this.airportForm.invalid || this.airportForm.pristine;
  }

  constructor(
    private airportsService: AirportsService,
    private airplanesService: AirplanesService,
    private pilotsService: PilotsService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.airportsService.loadAirports();
    this.airplanesService.loadAirplanes();
    this.pilotsService.loadPilots();
    const ports$ = this.airportsService.airportsState$.pipe(
      tap(airports => this.dataSource.data = airports),
    );
    const planes$ = this.airplanesService.airplanesState$.pipe(
      tap(planes => this.allAirplanes = planes)
    );
    const pilots$ = this.pilotsService.pilotsState$.pipe(
      tap(pilots => this.allPilots = pilots)
    );
    merge(ports$, planes$, pilots$).pipe(
      untilComponentDestroyed(this)
    ).subscribe();
  }

  private createForm() {
    this.airportForm = new FormGroup({
      airportCode: new FormControl('', Validators.required),
      airportName: new FormControl('', Validators.required),
      airportAddress: new FormControl('', Validators.required),
      airportAirplanesIds: new FormControl([], Validators.required),
      airportPilotsIds: new FormControl([], Validators.required)
    });
  }

  public addAirport() {
    const newAirport = this.airportForm.value;
    this.airportsService.addAirport({...newAirport});
    this.airportForm.reset();
    Object.keys(this.airportForm.controls).forEach(key => {
      this.airportForm.controls[key].setErrors(null);
    });
  }

  ngOnDestroy() {}
}
