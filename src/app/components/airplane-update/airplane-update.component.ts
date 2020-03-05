import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { merge } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IAirplane, IPilot } from 'src/app/interfaces';
import { AirplanesService, PilotsService } from 'src/app/services';

@Component({
  selector: 'app-airplane-update',
  templateUrl: './airplane-update.component.html',
  styleUrls: ['./airplane-update.component.scss']
})
export class AirplaneUpdateComponent implements OnInit, OnDestroy {
  public airplane: IAirplane;
  public form: FormGroup;
  public allPilots: IPilot[];
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
    const loadPilots$ = this.pilotsService.loadPilots();
    const pilots$ = this.pilotsService.pilotsState$.pipe(
      tap((pilots: IPilot[]) => this.allPilots = pilots),
    );
    const airplane$ = this.route.params.pipe(
      map((params: Params) => +params['id']),
      switchMap(id => {
        return this.airplanesService.getAirplane(id).pipe(
          tap((airplane) => {
            this.airplane = airplane;
            this.setFormValue(airplane);
          }),
        );
      })
    );
    merge(loadPilots$, pilots$, airplane$).pipe(untilComponentDestroyed(this)).subscribe();
  }

  private createForm() {
    this.form = new FormGroup({
      airplaneCode: new FormControl('', Validators.required),
      airplaneType: new FormControl('', Validators.required),
      airplaneSideNumber: new FormControl('', Validators.required),
      airplaneBrand: new FormControl('', [Validators.required, Validators.maxLength(199)]),
      airplaneModel: new FormControl('', Validators.required),
      airplanesPilotsIds: new FormControl([], Validators.required)
    });
  }

  private setFormValue(airplane: IAirplane) {
    this.form.patchValue({...airplane});
  }

  public updateAirplane() {
    const updatePlane = {...this.form.value, id: this.airplane.id};
    this.airplanesService.updateAirplane({...updatePlane}).pipe(
      tap(_ => {
        this.form.reset();
        this.router.navigate(['airplanes']);
      }),
      untilComponentDestroyed(this)
    ).subscribe();
  }

  public deleteAirplane() {
    this.airplanesService.deleteAirplane(this.airplane.id).pipe(
      tap(_ => {
        this.router.navigate(['airplanes']);
      }),
      untilComponentDestroyed(this)
      ).subscribe();
  }

  ngOnDestroy() {}

}
