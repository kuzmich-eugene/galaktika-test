import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IPilot, IAirplane } from 'src/app/interfaces';
import { PilotsService, AirplanesService } from 'src/app/services';

@Component({
  selector: 'app-pilots',
  templateUrl: './pilots.component.html',
  styleUrls: ['./pilots.component.scss']
})
export class PilotsComponent implements OnInit, OnDestroy {
  public pilotForm: FormGroup;
  public dataSource = new MatTableDataSource<IPilot>();
  public columns = ['pilotCode', 'pilotNum', 'pilotFullName', 'pilotAddress', 'pilotAirplanesIds'];
  public allAirplanes: IAirplane[];
  get formDisabled(): boolean {
    return this.pilotForm.invalid || this.pilotForm.pristine;
  }

  constructor(
    private pilotsService: PilotsService,
    private airplanesService: AirplanesService,
  ) { }

  ngOnInit() {
    this.createForm();
    const loadPilots$ = this.pilotsService.loadPilots();
    const loadPlanes$ = this.airplanesService.loadAirplanes();
    const planes$ = this.airplanesService.planesState$.pipe(
      tap(planes => this.allAirplanes = planes)
    );
    const pilots$ = this.pilotsService.pilotsState$.pipe(
      tap(pilots => this.dataSource.data = pilots),
    );
    merge(loadPilots$, loadPlanes$, planes$, pilots$).pipe(untilComponentDestroyed(this)).subscribe();
  }

  private createForm() {
    this.pilotForm = new FormGroup({
      pilotCode: new FormControl('', Validators.required),
      pilotNum: new FormControl('', Validators.required),
      pilotFullName: new FormControl('', Validators.required),
      pilotAddress: new FormControl('', Validators.required),
      pilotAirplanesIds: new FormControl([], Validators.required)
    });
  }

  public addPilot() {
    const newPilot = this.pilotForm.value;
    this.pilotsService.addPilot({...newPilot}).pipe(
      untilComponentDestroyed(this)
    ).subscribe();
    this.pilotForm.reset();
  }

  ngOnDestroy() {}
}
