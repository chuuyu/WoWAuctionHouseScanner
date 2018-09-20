import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MorrisJsModule } from 'angular-morris-js';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';

import { MessageService } from './message.service';
import { WowApiService } from './wow-api.service';
import { AuctionHouseComponent } from './auction-house/auction-house.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    AuctionHouseComponent,
    DashboardComponent
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
