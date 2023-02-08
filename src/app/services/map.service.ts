import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import markerData from 'src/assets/data.json';
import { IClient, ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  sMarkers = new BehaviorSubject<ISpecialist[]>([]);
  cMarkers = new BehaviorSubject<IClient[]>([]);

  data : ISpecialist[] = markerData;

  constructor() {
    this.sMarkers.next(this.data);
  }

  distanceCalc(latLng1: google.maps.LatLngLiteral, latLng2: google.maps.LatLngLiteral){
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      latLng1,
      latLng2
      );
    console.log(distance)  // answer is in meters
  }
  getSMarkers(): Observable<ISpecialist[]> { return this.sMarkers}
  getCMarkers(): Observable<IClient[]> { return this.cMarkers}

  getSMarkerInfo(mark: ISpecialist){
    let info = {
      Specialties: mark.Competenza_Princ,
      Degree: mark.Studi,
      City: mark.Domicilio,
      "Available to move": mark.Disp_Trasferimento ? 'yes' : 'no',
      "Available from": mark.Disponibilita_dal,
      "Notice time" : mark.Preavviso + ' days'
    }
    return info
  }

  getCMarkerInfo(mark: IClient){
    let info = {
      "Looking for": mark.Cerca,
      City: mark.Città,
      "Remote": mark.Disp_Online ? 'yes' : 'no',
      "Available from": mark.Disponibilita_dal,
    }
    return info
  }

  addSMarker(newSpecialist: ISpecialist){
    let newMarkers: ISpecialist[] = []
    this.sMarkers.subscribe(val=>
        newMarkers = [...val, newSpecialist]
      )
    this.sMarkers.next(newMarkers)}
  
  addCMarker(newClient: IClient){
    let newMarkers: IClient[] = []
    this.cMarkers.subscribe(val=>
      newMarkers = [...val, newClient]
      )
    this.cMarkers.next(newMarkers)}
    
  
}
