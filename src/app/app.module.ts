import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';

import { MaterialComponent } from './material/material.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { AirportComponent } from './airport/airport.component';
import { DapiDemoComponent } from './dapi-demo/dapi-demo.component';

import {AirOffersService} from './services/air-offers.service';
import {DapiAuthenticationService} from './services/dapi-authentication.service';
import { MongolabComponent } from './mongolab/mongolab.component';
import { FacebookComponent } from './facebook/facebook.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PushNotificationsService } from './services/push-notifications.service';
import { FacebookService } from './services/facebook.service';
import { DatabaseService } from './services/database.service';

@NgModule({
  declarations: [
    AppComponent,
    MaterialComponent,
    BootstrapComponent,
    AirportComponent,
    DapiDemoComponent,
    MongolabComponent,
    FacebookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js'): []
  ],
  providers: [AirOffersService, DapiAuthenticationService, 
              PushNotificationsService, FacebookService, DatabaseService],
  bootstrap: [FacebookComponent]
})
export class AppModule { }
