import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  markers: ISpecialist[] =  [];  
  markersSubs ?: Subscription;
  
  INITIAL_COORDS = [44.4949, 11.3426]; // Bologna
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 4;

  constructor(private map: MapService){}
  
  ngOnInit(){
    this.markersSubs = this.map.getMarkers().subscribe(
      // val => console.log(val, typeof(val))
      val => this.markers = val
    );
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }
  
  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }
}
