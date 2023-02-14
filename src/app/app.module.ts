import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  

import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatSliderModule } from '@angular/material/slider';
import { HammerModule} from '@angular/platform-browser';
import { AddNewComponent } from './home/sidebar/add-new/add-new.component';
import { FilterComponent } from './home/sidebar/filter/filter.component';

// npm i ngx-mat-intl-tel-input --save
// npm install libphonenumber-js --save

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    AddNewComponent,
    FilterComponent,
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
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatIntlTelInputComponent,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    CdkAccordionModule,
    MatSliderModule,
    HammerModule,

    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
