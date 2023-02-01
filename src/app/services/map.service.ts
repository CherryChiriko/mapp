import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import markerData from 'src/assets/data.json'
import { ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  markers = new BehaviorSubject<ISpecialist[]>([])
  //data : ISpecialist[] = markerData;

  constructor(private http: HttpClient) {
    // http.get("src/assets/data.json").subscribe( dat => this.markers.next(dat))
    //this.markers.next(this.data);
  }

  distanceCalc(latLng1: google.maps.LatLngLiteral, latLng2: google.maps.LatLngLiteral){
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      latLng1,
      latLng2
      );
    console.log(distance)  // answer is in meters
  }
  getMarkers(): Observable<ISpecialist[]> { return this.markers}
  // getMarkers() {
  //   console.log( this.markers)
  //   console.log( this.markers)
  // }
}
