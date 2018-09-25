import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MorrisJsModule } from 'angular-morris-js';

import { AppComponent } from './app.component';

import { MessageService } from './message.service';
import { WowApiService } from './wow-api.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    AuctionDetailsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    MorrisJsModule,
    AppRoutingModule
  ],
  providers: [MessageService, WowApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
