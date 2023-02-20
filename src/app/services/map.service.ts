import { Injectable } from '@angular/core';
import { IClient, ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  
  getSMarkerInfo(mark: ISpecialist){
    let info = {
      Specialties: mark.skills,
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
      "Available from": mark.available_from,
      "Notice time" : mark.notice + ' days'
    }
    return info
  }
   
  
}
