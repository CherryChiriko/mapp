import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  
  markers !: any;  // Fare un'interfaccia quando conosciamo la struttura del JSON

  ngOnInit(){
    this.http.get(this.URL).subscribe( dat => this.markers = dat )
    this.distanceCalc();
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  latitude1 = 39.46;
  longitude1 = -0.36;
  latitude2 = 40.40;
  longitude2 = -3.68;

  distanceCalc(){
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.latitude1, this.longitude1), 
      new google.maps.LatLng(this.latitude2, this.longitude2)
      );
    console.log(distance)  // answer is in meters
  }
}
