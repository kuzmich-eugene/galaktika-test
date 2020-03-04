import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IPilot } from '../interfaces';

@Injectable()
export class PilotsService {
  private _pilotsState = new BehaviorSubject<IPilot[]>([]);
  get pilotsState$() {
    return this._pilotsState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadPilots() {
    this.http.get<IPilot[]>('/api/pilots').pipe(
      tap(pilots => this._pilotsState.next(pilots))
    ).subscribe();
  }

  public getPilot(id: number) {
    const pilots = this._pilotsState.getValue();
    const pilot = pilots.find((item) => item.id === id);
    if (pilot) {
      return of(pilot);
    }
    return this.http.get<IPilot>(`/api/pilots/${id}`);
  }

  public addPilot(pilot: IPilot) {
    this.http.post<IPilot>('/api/pilots', pilot).pipe(
      tap((pilotFromBack: IPilot) => {
        const currState = this._pilotsState.getValue();
        const newState = [...currState, pilotFromBack];
        this._pilotsState.next(newState);
      }
    )).subscribe();
  }

  public updatePilot(pilot: IPilot) {
    this.http.put<IPilot>(`/api/pilots/${pilot.id}`, pilot).pipe(
      tap(_ => {
        const currState = this._pilotsState.getValue();
        const newState = currState.map(pil => {
          if (pil.id === pilot.id) {
            return pilot;
          }
          return pil;
        });
        this._pilotsState.next(newState);
      })).subscribe();
  }

  public deletePilot(id: number) {
    this.http.delete(`api/pilots/${id}`).pipe(
      tap(_ => {
        const currState = this._pilotsState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this._pilotsState.next(newState);
      })).subscribe();
  }
}
