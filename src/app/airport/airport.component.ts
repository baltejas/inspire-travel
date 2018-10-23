import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.css']
})
export class AirportComponent implements OnInit {
  @Input() airport: any;

  constructor() { }

  ngOnInit() {
  }

}
