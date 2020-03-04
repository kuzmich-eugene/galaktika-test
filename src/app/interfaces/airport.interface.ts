export interface IAirport {
  id: number;
  airportCode: string;
  airportName: string;
  airportAddress: string;
  airportAirplanesIds: number[];
  airportPilotsIds: number[];
}
