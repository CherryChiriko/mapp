import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  distanceCalc(latLng1: google.maps.LatLngLiteral, latLng2: google.maps.LatLngLiteral){
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      latLng1,
      latLng2
      );
    console.log(distance)  // answer is in meters
  }
}
