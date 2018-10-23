import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-bootstrap',
  templateUrl: './bootstrap.component.html',
  styleUrls: ['./bootstrap.component.css']
})
export class BootstrapComponent implements OnInit {

  airports = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onInputAirportNames(event) {
    this.airports.length = 0;

    let queryUrl = 'api/airports';
    let params = {};

    if (event.target.value) {
      params = {
        'search': event.target.value
      };
    }
    this.http.get(queryUrl, {params: params}).subscribe((res: any) => {
      // hardcoded data for local server
      this.airports = res.airports;
    }, (error: any) => {
        this.airports = [
          {
          "airportname": "Le Touquet Paris Plage",
          "city": "Le Tourquet",
          "country": "France",
          "faa": "LTQ"
        },
        {
          "airportname": "London St Pancras",
          "city": "London",
          "country": "United Kingdom",
          "faa": "STP"
        }
      ];
    });
  }
}
