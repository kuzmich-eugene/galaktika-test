import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IAirplane } from '../interfaces';

@Injectable()
export class AirplanesService {
  private _airplanesState = new BehaviorSubject<IAirplane[]>([]);
  get airplanesState$() {
    return this._airplanesState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadAirplanes() {
    this.http.get<IAirplane[]>('/api/airplanes').pipe(
      tap(airplanes => this._airplanesState.next(airplanes))
    ).subscribe();
  }

  public getAirplane(id: number) {
    const airplanes = this._airplanesState.getValue();
    const airplane = airplanes.find((item) => item.id === id);
    if (airplane) {
      return of(airplane);
    }
    return this.http.get<IAirplane>(`/api/airplanes/${id}`);
  }

  public addAirplane(airplane: IAirplane) {
    this.http.post<IAirplane>('/api/airplanes', airplane).pipe(
      tap((airplaneFromBack: IAirplane) => {
        const currState = this._airplanesState.getValue();
        const newState = [...currState, airplaneFromBack];
        this._airplanesState.next(newState);
      }
    )).subscribe();
  }

  public updateAirplane(airplane: IAirplane) {
    this.http.put<IAirplane>(`/api/airplanes/${airplane.id}`, airplane).pipe(
      tap(_ => {
        const currState = this._airplanesState.getValue();
        const newState = currState.map(plane => {
          if (plane.id === airplane.id) {
            return airplane;
          }
          return plane;
        });
        this._airplanesState.next(newState);
      })).subscribe();
  }

  public deleteAirplane(id: number) {
    this.http.delete(`api/airplanes/${id}`).pipe(
      tap(_ => {
        const currState = this._airplanesState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this._airplanesState.next(newState);
      })).subscribe();
  }
}
