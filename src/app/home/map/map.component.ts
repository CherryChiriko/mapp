import { KeyValue } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { HelperService } from 'src/app/services/helper.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  specialists: ISpecialist[] =  [];
  clients: IClient[] =  [];
  markersSubs ?: Subscription;

  INITIAL_COORDS = [41.9028, 12.4964]; // Roma
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 5;

  color: string = "var(--google-green)";
  lightColor: string = "var(--light-green)";
  darkColor: string = "var(--dark-green)";

  color1: string = "var(--google-blue)";
  lightColor1: string = "var(--light-blue)";
  darkColor1: string = "var(--dark-blue)";

  contacts: boolean[] = [];

  constructor(private map: MapService, private _excel : ExcelService, private helper: HelperService){}

  ngOnInit(){
     //this.markersSubs = this._excel.getAll().subscribe(
       //value => this.specialists = value);
    this.markersSubs = this.map.getSMarkers().subscribe(
      value => this.specialists = value);
    this.markersSubs = this.map.getCMarkers().subscribe(
      value => this.clients = value);
  }


  originalOrder =
  (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {return 0;}

  markerSInfo(mark: ISpecialist){ return this.map.getSMarkerInfo(mark)}
  markerCInfo(mark: IClient){ return this.map.getCMarkerInfo(mark)}
  
  toggleContacts(i: number){    this.contacts[i] = !this.contacts[i];  }
  setContact(){
    if (!this.contacts.length){
    for (let i = 0; i<this.specialists.length; i++){
      this.contacts.push(false);
    }}
    else {      this.contacts.map( contact => contact = false)    }
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    this.setContact();
    infoWindow.open(marker);
  }

  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }

  groupByCity(cityName: string){
    // const cityGroup = this.helper.groupArray<ISpecialist, string>(this.specialists, (p => p.Domicilio));
    return this.specialists.filter( specialist => specialist.Domicilio === cityName)
  }

}
