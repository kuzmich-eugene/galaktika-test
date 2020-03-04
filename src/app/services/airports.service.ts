import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IAirport } from '../interfaces';

@Injectable()
export class AirportsService {
  private _airportsState = new BehaviorSubject<IAirport[]>([]);
  get airportsState$() {
    return this._airportsState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadAirports() {
    this.http.get<IAirport[]>('/api/airports').pipe(
      tap(airports => this._airportsState.next(airports))
    ).subscribe();
  }

  public getAirport(id: number) {
    const airports = this._airportsState.getValue();
    const airport = airports.find((item) => item.id === id);
    if (airport) {
      return of(airport);
    }
    return this.http.get<IAirport>(`/api/airports/${id}`);
  }

  public addAirport(airport: IAirport) {
    this.http.post<IAirport>('/api/airports', airport).pipe(
      tap((airportFromBack: IAirport) => {
        const currState = this._airportsState.getValue();
        const newState = [...currState, airportFromBack];
        this._airportsState.next(newState);
      }
    )).subscribe();
  }

  public updateAirport(airport: IAirport) {
    this.http.put<IAirport>(`/api/airports/${airport.id}`, airport).pipe(
      tap(_ => {
        const currState = this._airportsState.getValue();
        const newState = currState.map(port => {
          if (port.id === airport.id) {
            return airport;
          }
          return port;
        });
        this._airportsState.next(newState);
      })).subscribe();
  }

  public deleteAirport(id: number) {
    this.http.delete(`api/airports/${id}`).pipe(
      tap(_ => {
        const currState = this._airportsState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this._airportsState.next(newState);
      })).subscribe();
  }
}
