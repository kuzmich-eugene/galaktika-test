import * as R from 'ramda';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IAirplane, IPilot } from 'src/app/interfaces';
import { AirplanesService, PilotsService } from 'src/app/services';
import { merge } from 'rxjs';

@Component({
  selector: 'app-airplanes',
  templateUrl: './airplanes.component.html',
  styleUrls: ['./airplanes.component.scss']
})
export class AirplanesComponent implements OnInit, OnDestroy {
  public airplaneForm: FormGroup;
  public dataSource = new MatTableDataSource<IAirplane>();
  public columns = ['airplaneCode', 'airplaneType', 'airplaneSideNumber', 'airplaneBrand', 'airplaneModel'];
  public allPilots: IPilot[];

  get formDisabled(): boolean {
    return this.airplaneForm.pristine || this.airplaneForm.invalid;
  }

  constructor(
    private airplanesService: AirplanesService,
    private pilotsService: PilotsService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.airplanesService.loadAirplanes();
    this.pilotsService.loadPilots();
    const pilots$ = this.pilotsService.pilotsState$.pipe(
      tap(pilots => this.allPilots = pilots)
    );
    const airplanes$ = this.airplanesService.airplanesState$.pipe(
      tap(airplanes => this.dataSource.data = airplanes)
    );
    merge(pilots$, airplanes$).pipe(untilComponentDestroyed(this)).subscribe();
  }

  public isCharA(codeAirplane: string) {
    return R.find(item => item === 'A', codeAirplane) ? true : false;
  }

  private createForm() {
    this.airplaneForm = new FormGroup({
      airplaneCode: new FormControl('', Validators.required),
      airplaneType: new FormControl('', Validators.required),
      airplaneSideNumber: new FormControl('', Validators.required),
      airplaneBrand: new FormControl('', [Validators.required, Validators.maxLength(199)]),
      airplaneModel: new FormControl('', Validators.required),
      airplanesPilotsIds: new FormControl([], Validators.required)
    });
  }

  public addAirplane() {
    const newAirplane = this.airplaneForm.value;
    this.airplanesService.addAirplane({...newAirplane});
    this.airplaneForm.reset();
    Object.keys(this.airplaneForm.controls).forEach(key => {
      this.airplaneForm.controls[key].setErrors(null);
    });
  }

  ngOnDestroy() {}

}
