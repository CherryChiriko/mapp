import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './home/map/map.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

  

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
