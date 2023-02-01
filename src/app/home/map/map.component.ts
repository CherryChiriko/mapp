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
  contacts: boolean[] = [];

  constructor(private map: MapService, private _excel : ExcelService){}

  ngOnInit(){
     //this.markersSubs = this._excel.getAll().subscribe(
       //value => this.specialists = value);
    this.markersSubs = this.map.getMarkers().subscribe(
      value => this.specialists = value);
  }

<<<<<<< HEAD

  originalOrder =
  (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {return 0;}

=======
  
  originalOrder = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {return 0;}
>>>>>>> 30b08b7af7f4c3b990b5f006c4ce3820a7d54087
  markerInfo(mark: ISpecialist){ return this.map.getMarkerInfo(mark)}
  
  toggleContacts(i: number){
    this.contacts[i] = !this.contacts[i];
    // return this.contacts
  }
  setContact(){
    if (!this.contacts.length){
    for (let i = 0; i<this.specialists.length; i++){
      this.contacts.push(false);
    }}
    else {
      this.contacts.map( contact => contact = false)
    }
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    this.setContact();
    infoWindow.open(marker);
  }

  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }
}
