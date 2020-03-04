import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { IAirport } from '../interfaces/airport.interface';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const airports = [
      {
        airportCode: 'MSQ',
        airportName: 'Minsk National Airport',
        airportAddress: 'Minsk',
        airportAirplanesIds: [11],
        airportPilotsIds: [11],
        id: 11
      },
      {
        airportCode: 'SWO',
        airportName: 'Sheremetyevo',
        airportAddress: 'Moscow',
        airportAirplanesIds: [12],
        airportPilotsIds: [12],
        id: 12
      },
    ];
    const pilots = [
      { pilotCode: '101', pilotNum: 'BBC', pilotFullName: 'M. FREG', pilotAddress: 'Minsk', pilotAirplanesIds: [11], id: 11 },
      { pilotCode: '102', pilotNum: 'ABB', pilotFullName: 'M. Petrov', pilotAddress: 'Moscow', pilotAirplanesIds: [12], id: 12 }
    ];
    const airplanes = [
      {
        airplaneCode: '001002',
        airplaneType: 'pass',
        airplaneSideNumber: '001',
        airplaneBrand: 'SSJ',
        airplaneModel: '100/95',
        airplanesPilotsIds: [11],
        id: 11
      },
      {
        airplaneCode: '002003',
        airplaneType: 'pass',
        airplaneSideNumber: '002',
        airplaneBrand: 'Airbus',
        airplaneModel: 'A310',
        airplanesPilotsIds: [12],
        id: 12
      },
    ];
    return { airports, pilots, airplanes };
  }
  genId(data): number {
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 11;
  }
}
