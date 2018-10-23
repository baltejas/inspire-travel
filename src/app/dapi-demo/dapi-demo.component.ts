import { Component, OnInit } from '@angular/core';
import {AirOffersService} from '../services/air-offers.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-dapi-demo',
  templateUrl: './dapi-demo.component.html',
  styleUrls: ['./dapi-demo.component.css']
})
export class DapiDemoComponent implements OnInit {
  from: string;
  to: string;
  result: any;
  loading: boolean = false;

  constructor(private offerSvc: AirOffersService, private route: ActivatedRoute) {
    this.route.params.subscribe( params => {
      this.from = params.from;
      this.to = params.to;
    });
  }

  ngOnInit() {
    let departDate = '2018-08-22';
    let returnDate = '2018-09-19';
    let ff = 'ECONOMY1';
    let travellers = '1ADT';
    this.loading = true;
    this.offerSvc.getCalendar(this.from, this.to, departDate, returnDate, ff, travellers).subscribe(
	    (response: any) => {
	      this.result = JSON.stringify(response, null, 2);
	      this.loading = false;
	    },
	    (error: any) => {
	      this.result = JSON.stringify(error, null, 2);
	      this.loading = false;
	    }
    );
  }

}
