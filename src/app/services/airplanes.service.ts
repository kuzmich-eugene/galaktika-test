import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IAirplane } from '../interfaces';

@Injectable()
export class AirplanesService {
  private _planesState = new BehaviorSubject<IAirplane[]>([]);
  get planesState$() {
    return this._planesState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadAirplanes(): Observable<IAirplane[]> {
    return this.http.get<IAirplane[]>('/api/airplanes').pipe(
      tap(airplanes => this._planesState.next(airplanes))
    );
  }

  public getAirplane(id: number): Observable<IAirplane> {
    const airplanes = this._planesState.getValue();
    const airplane = airplanes.find((item) => item.id === id);
    if (airplane) {
      return of(airplane);
    }
    return this.http.get<IAirplane>(`/api/airplanes/${id}`);
  }

  public addAirplane(airplane: IAirplane): Observable<IAirplane> {
    return this.http.post<IAirplane>('/api/airplanes', airplane).pipe(
      tap((airplaneFromBack: IAirplane) => {
        const currState = this._planesState.getValue();
        const newState = [...currState, airplaneFromBack];
        this._planesState.next(newState);
      }
    ));
  }

  public updateAirplane(airplane: IAirplane): Observable<IAirplane> {
    return this.http.put<IAirplane>(`/api/airplanes/${airplane.id}`, airplane).pipe(
      tap(_ => {
        const currState = this._planesState.getValue();
        const newState = currState.map(plane => {
          if (plane.id === airplane.id) {
            return airplane;
          }
          return plane;
        });
        this._planesState.next(newState);
      }));
  }

  public deleteAirplane(id: number): Observable<IAirplane> {
    return this.http.delete<IAirplane>(`api/airplanes/${id}`).pipe(
      tap(_ => {
        const currState = this._planesState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this._planesState.next(newState);
      }));
  }
}
