import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  specialists: ISpecialist[] =  [];
  markersSubs ?: Subscription;

  INITIAL_COORDS = [41.9028, 12.4964]; // Roma
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 5;

  color: string = "orange";

  constructor(private map: MapService){}

  ngOnInit(){
    // this.markersSubs = this._excel.getAll().subscribe(
    //   value => this.specialists = value);
    this.markersSubs = this.map.getMarkers().subscribe(
      value => this.specialists = value);
  }

  
  originalOrder = 
  (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {return 0;}

  markerInfo(mark: ISpecialist){ return this.map.getMarkerInfo(mark)}

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }
}
