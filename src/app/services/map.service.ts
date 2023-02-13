import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import sData from 'src/assets/data.json';
import cData from 'src/assets/clients.json';
import { IClient, ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  sMarkers = new BehaviorSubject<ISpecialist[]>([]);
  cMarkers = new BehaviorSubject<IClient[]>([]);

  sData : ISpecialist[] = sData;
  cData : IClient[] = cData;

  constructor() {
    this.sMarkers.next(this.sData);
    this.cMarkers.next(this.cData);
  }

  getSMarkers(): Observable<ISpecialist[]> { return this.sMarkers}
  getCMarkers(): Observable<IClient[]> { return this.cMarkers}

  getSMarkerInfo(mark: ISpecialist){
    let info = {
      Specialties: mark.skill,
      Degree: mark.degree,
      City: mark.city,
      "Available to move": mark.canMove ? 'yes' : 'no',
      "Available from": mark.available_from,
      "Notice time" : mark.notice + ' days'
    }
    return info
  }

  getCMarkerInfo(mark: IClient){
    let info = {
      "Looking for": mark.lookFor,
      "City": mark.city,
      "Remote": mark.remoteOption ? 'yes' : 'no',
      "Available from": mark.available_from,
      "Notice time" : mark.notice + ' days'
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
