import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AIR_OFFERS_HEADERS } from '../../environments/environment';

import {DapiAuthenticationService} from './dapi-authentication.service';


@Injectable()
export class AirOffersService {

  offerResponse: any;
  calendarResponse: any;
  auth: any;
  httpOptions: any;


  constructor(private http: HttpClient, private authentication: DapiAuthenticationService) {}

  generateHeaders() {
    this.auth = this.authentication.getAuthentication();
    console.log(this.auth);

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': AIR_OFFERS_HEADERS['Content-Type'],
        'Authorization': this.auth
      })
    };
  }

  getCalendar(origin , dest , departDate , returnDate , commericialFamilyFare , travellers) {
    this.generateHeaders();
    const apiUrl: string =
      `dapi/air-calendars?originLocationCode=${origin}` +
      `&destinationLocationCode=${dest}` +
      `&departureDateTime=${departDate}` +
      `&travelers=${travellers}` +
      `&commercialFareFamilies=${commericialFamilyFare}`;

    return this.http.get(apiUrl , this.httpOptions)
      .pipe(map(_ => {
        this.calendarResponse = { ..._ };
        return this.calendarResponse;
      }));
  }
}
