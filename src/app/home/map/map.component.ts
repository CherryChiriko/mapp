import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  
  INITIAL_COORDS = [44.4949, 11.3426]; // Bologna
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 4;

  private URL = '../assets/data.json';
  constructor(private http: HttpClient){}
  
  reactiveForm !: FormGroup;
  markers !: any;  // Fare un'interfaccia quando conosciamo la struttura del JSON
  cities !: any;

  ngOnInit(){
    this.http.get(this.URL).subscribe( dat => this.markers = dat )
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }
  
}
