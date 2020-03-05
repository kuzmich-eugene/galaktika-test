import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { untilComponentDestroyed } from 'ng2-rx-componentdestroyed';

import { IAirport, IAirplane, IPilot } from 'src/app/interfaces';
import { AirportsService, AirplanesService, PilotsService } from 'src/app/services';

@Component({
  selector: 'app-airport-update',
  templateUrl: './airport-update.component.html',
  styleUrls: ['./airport-update.component.scss']
})
export class AirportUpdateComponent implements OnInit, OnDestroy {
  public airport: IAirport;
  public form: FormGroup;
  public allAirplanes: IAirplane[];
  public allPilots: IPilot[];
  get formDisabled(): boolean {
    return this.form.invalid || this.form.pristine;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private airportsService: AirportsService,
    private airplanesService: AirplanesService,
    private pilotsService: PilotsService
  ) { }

  ngOnInit() {
    this.createForm();
    const loadPlanes$ = this.airplanesService.loadAirplanes();
    const loadPilots$ = this.pilotsService.loadPilots();
    const pilots$ = this.pilotsService.pilotsState$.pipe(
      tap(v => this.allPilots = v)
    );
    const airplanes$ = this.airplanesService.planesState$.pipe(
      tap(v => this.allAirplanes = v),
    );
    const airport$ = this.route.params.pipe(
      map((params: Params) => +params['id']),
      switchMap(id => {
        return this.airportsService.getAirport(id).pipe(
          tap((airport) => {
            console.log(airport);
            this.airport = airport;
            this.setFormValue(airport);
          }),
        );
      })
    );
    merge(loadPlanes$, loadPilots$, pilots$, airplanes$, airport$).pipe(untilComponentDestroyed(this)).subscribe();
  }

  private createForm() {
    this.form = new FormGroup({
      airportCode: new FormControl('', Validators.required),
      airportName: new FormControl('', Validators.required),
      airportAddress: new FormControl('', Validators.required),
      airportAirplanesIds: new FormControl([], Validators.required),
      airportPilotsIds: new FormControl([], Validators.required)
    });
  }

  private setFormValue(port) {
      this.form.patchValue({...port});
  }

  public updateAirport() {
    const updatePort = {...this.form.value, id: this.airport.id};
    this.airportsService.updateAirport({...updatePort}).pipe(
      tap(_ => {
        this.form.reset();
        this.router.navigate(['airports']);
      }),
      untilComponentDestroyed(this)
    ).subscribe();
  }

  public deleteAirport() {
    this.airportsService.deleteAirport(this.airport.id).pipe(
      tap(_ => {
        this.router.navigate(['airports']);
      }),
      untilComponentDestroyed(this)
      ).subscribe();
  }

  ngOnDestroy() {}

}
