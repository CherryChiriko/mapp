import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { HelperService } from 'src/app/services/helper.service';
import { MapService } from 'src/app/services/map.service';

const INITIAL_COORDS = [41.9028, 12.4964]; // Roma

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  specialists: ISpecialist[] =  [];
  clients: IClient[] =  [];
  allMarkers: any[] = [];
  markersSubs ?: Subscription;

 
  center: google.maps.LatLngLiteral = { lat: INITIAL_COORDS[0], lng: INITIAL_COORDS[1]};
  zoom = 5;

  contacts: boolean[] = [];
  // isMixed : boolean = false;

  constructor(private map: MapService, private _excel : ExcelService, private helper: HelperService){}

  ngOnInit(){
     //this.markersSubs = this._excel.getAll().subscribe(
       //value => this.specialists = value);
    this.markersSubs = this.map.getSMarkers().subscribe(
      value => this.specialists = value);
    this.markersSubs = this.map.getCMarkers().subscribe(
      value => this.clients = value);
    this.allMarkers = [...this.clients, ...this.specialists];
  }

  originalOrder =
  (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {return 0;}
  
  toggleContacts(i: number){    this.contacts[i] = !this.contacts[i];  }
  setContact(){
    if (!this.contacts.length){
    for (let i = 0; i<this.specialists.length; i++){
      this.contacts.push(false);
    }}
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    this.setContact();
    infoWindow.open(marker);
  }
  closeInfoWindow(infoWindow: MapInfoWindow) {
    infoWindow.close();
  }

  isClient(element: IClient | ISpecialist){    return element.hasOwnProperty('website') ?  true : false  }

  filterByCity(arr: any[], cityName: string){  return arr.filter(element => element.city === cityName)}
  groupByCity(cityName: string): any[]  { 
    // this.isMixed = false;
    let sGroup = this.filterByCity(this.specialists, cityName); 
    let cGroup = this.filterByCity(this.clients, cityName);
    // if (sGroup.length > 0 && cGroup.length > 0 ){ this.isMixed = true}
    return [...cGroup, ...sGroup]
  }

  markerInfo(condition: boolean, mark: any){ return condition? this.map.getCMarkerInfo(mark): this.map.getSMarkerInfo(mark)}

  getColorScheme(condition: boolean){
    let color = condition? 'blue': 'green';
    return {
      color:      `var(--google-${color})`,
      lightColor: `var(--light-${color})`,
      darkColor:  `var(--dark-${color})`,
      dot: `${color}`
    } 
  }
  getIcon(condition: boolean){
    const url = "http://maps.google.com/mapfiles/ms/icons/";
    // const dotColor = this.isMixed ? 'red' : this.getColorScheme(condition).dot
    const dotColor = this.getColorScheme(condition).dot
    return `${url}${dotColor}-dot.png`;
  }


  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }

  filterForCompany(client: IClient){}
}
