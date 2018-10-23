import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialComponent } from './material/material.component';
import { BootstrapComponent } from './bootstrap/bootstrap.component';
import { DapiDemoComponent } from './dapi-demo/dapi-demo.component';
import { MongolabComponent } from './mongolab/mongolab.component';
import { FacebookComponent } from './facebook/facebook.component';

const routes: Routes = [
{path: 'home', component: BootstrapComponent},
{path: 'home-mat', component: MaterialComponent},
{path: 'dapi-demo/:from/:to', component: DapiDemoComponent},
{path: 'mongo-demo', component: MongolabComponent},
{path: 'app-facebook', component: FacebookComponent},
{path: '', redirectTo: 'home', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
