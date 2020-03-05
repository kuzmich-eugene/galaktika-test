import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IAirport } from '../interfaces';

@Injectable()
export class AirportsService {
  private _portsState = new BehaviorSubject<IAirport[]>([]);
  get portsState$() {
    return this._portsState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadAirports(): Observable<IAirport[]> {
    return this.http.get<IAirport[]>('/api/airports').pipe(
      tap(airports => this._portsState.next(airports))
    );
  }

  public getAirport(id: number): Observable<IAirport> {
    const airports = this._portsState.getValue();
    const airport = airports.find((item) => item.id === id);
    if (airport) {
      return of(airport);
    }
    return this.http.get<IAirport>(`/api/airports/${id}`);
  }

  public addAirport(airport: IAirport): Observable<IAirport> {
    return this.http.post<IAirport>('/api/airports', airport).pipe(
      tap((airportFromBack: IAirport) => {
        const currState = this._portsState.getValue();
        const newState = [...currState, airportFromBack];
        this._portsState.next(newState);
      }
    ));
  }

  public updateAirport(airport: IAirport): Observable<IAirport> {
    return this.http.put<IAirport>(`/api/airports/${airport.id}`, airport).pipe(
      tap(_ => {
        const currState = this._portsState.getValue();
        const newState = currState.map(port => {
          if (port.id === airport.id) {
            return airport;
          }
          return port;
        });
        this._portsState.next(newState);
      }));
  }

  public deleteAirport(id: number): Observable<IAirport> {
    return this.http.delete<IAirport>(`api/airports/${id}`).pipe(
      tap(_ => {
        const currState = this._portsState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this._portsState.next(newState);
      }));
  }
}
