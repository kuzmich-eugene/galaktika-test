import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { merge } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IPilot, IAirplane } from 'src/app/interfaces';
import { AirplanesService, PilotsService } from 'src/app/services';

@Component({
  selector: 'app-pilot-update',
  templateUrl: './pilot-update.component.html',
  styleUrls: ['./pilot-update.component.scss']
})
export class PilotUpdateComponent implements OnInit, OnDestroy {
  public pilot: IPilot;
  public form: FormGroup;
  public allAirplanes: IAirplane[];
  get formDisabled(): boolean {
    return this.form.invalid || this.form.pristine;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private airplanesService: AirplanesService,
    private pilotsService: PilotsService
  ) { }

  ngOnInit() {
    this.createForm();
    const loadPlanes$ = this.airplanesService.loadAirplanes();
    const planes$ = this.airplanesService.planesState$.pipe(
      tap(planes => this.allAirplanes = planes),
    );
    const pilot$ = this.route.params.pipe(
      map((params: Params) => +params['id']),
      switchMap(id => {
        return this.pilotsService.getPilot(id).pipe(
          tap((pilot) => {
            this.pilot = pilot;
            this.setFormValue(pilot);
          }),
        );
      })
    );
    merge(loadPlanes$, planes$, pilot$).pipe(untilComponentDestroyed(this)).subscribe();
  }

  private createForm() {
    this.form = new FormGroup({
      pilotCode: new FormControl('', Validators.required),
      pilotNum: new FormControl('', Validators.required),
      pilotFullName: new FormControl('', Validators.required),
      pilotAddress: new FormControl('', Validators.required),
      pilotAirplanesIds: new FormControl([], Validators.required)
    });
  }

  private setFormValue(pilot: IPilot) {
    this.form.patchValue({...pilot});
  }

  public updatePilot() {
    const updatePilot = {...this.form.value, id: this.pilot.id};
    this.pilotsService.updatePilot({...updatePilot}).pipe(
      tap(_ => {
        this.form.reset();
        this.router.navigate(['pilots']);
      }),
      untilComponentDestroyed(this)
    ).subscribe();
  }

  public deletePilot() {
    this.pilotsService.deletePilot(this.pilot.id).pipe(
      tap(_ => {
        this.router.navigate(['pilots']);
      }),
      untilComponentDestroyed(this)
    ).subscribe();
  }

  ngOnDestroy() {}

}
