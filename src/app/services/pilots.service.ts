import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IPilot } from '../interfaces';

@Injectable()
export class PilotsService {
  private pilotsState = new BehaviorSubject<IPilot[]>([]);
  get pilotsState$() {
    return this.pilotsState.asObservable();
  }

  constructor(
    private readonly http: HttpClient
  ) {}

  public loadPilots(): Observable<IPilot[]> {
    return this.http.get<IPilot[]>('/api/pilots').pipe(
      tap(pilots => this.pilotsState.next(pilots))
    );
  }

  public getPilot(id: number): Observable<IPilot> {
    const pilots = this.pilotsState.getValue();
    const pilot = pilots.find((item) => item.id === id);
    if (pilot) {
      return of(pilot);
    }
    return this.http.get<IPilot>(`/api/pilots/${id}`);
  }

  public addPilot(pilot: IPilot): Observable<IPilot> {
    return this.http.post<IPilot>('/api/pilots', pilot).pipe(
      tap((pilotFromBack: IPilot) => {
        const currState = this.pilotsState.getValue();
        const newState = [...currState, pilotFromBack];
        this.pilotsState.next(newState);
      }
    ));
  }

  public updatePilot(pilot: IPilot): Observable<IPilot> {
    return this.http.put<IPilot>(`/api/pilots/${pilot.id}`, pilot).pipe(
      tap(_ => {
        const currState = this.pilotsState.getValue();
        const newState = currState.map(pil => {
          if (pil.id === pilot.id) {
            return pilot;
          }
          return pil;
        });
        this.pilotsState.next(newState);
      }));
  }

  public deletePilot(id: number): Observable<IPilot> {
    return this.http.delete<IPilot>(`api/pilots/${id}`).pipe(
      tap(_ => {
        const currState = this.pilotsState.getValue();
        const newState = currState.filter(item => item.id !== id);
        this.pilotsState.next(newState);
      }));
  }
}
