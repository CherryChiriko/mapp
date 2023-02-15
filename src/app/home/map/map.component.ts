import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { combineLatest, Subscription } from 'rxjs';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
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

  sMarkersSubs ?: Subscription;
  cMarkersSubs ?: Subscription;
  allMarkersSubs ?: Subscription;

  // _clients: IClient[] = [];
  // get clients() { return this._clients;}
  // set clients(value) {console.log(value);this._clients = value;}
 
  center: google.maps.LatLngLiteral = { lat: INITIAL_COORDS[0], lng: INITIAL_COORDS[1]};
  zoom = 5;

  contacts: boolean[] = [];
  // isMixed : boolean = false;

  constructor(private map: MapService, private filter : FilterService, private helper: HelperService){}

  ngOnInit(){
    // this.markersSubs = this.map.getSMarkers().subscribe(
    //   value => this.specialists = value);
    // this.markersSubs = this.map.getCMarkers().subscribe(
    //   value => this.clients = value);

    this.sMarkersSubs = this.filter.sFilterData().subscribe(
      value => this.specialists = value);
    this.cMarkersSubs = this.filter.cFilterData().subscribe(
      value => this.clients = value);
    // this.allMarkers = [...this.clients, ...this.specialists];
    // console.log(this.allMarkers)
    this.allMarkersSubs = 
    combineLatest([this.filter.sFilterData(), this.filter.cFilterData()])
    .subscribe(([specialists, clients]) => this.allMarkers = [...clients,...specialists])
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

  getColor(condition: boolean){return this.helper.getColorScheme(condition)}
  getIcon(condition: boolean){
    const url = "http://maps.google.com/mapfiles/ms/icons/";
    // const dotColor = this.isMixed ? 'red' : this.getColorScheme(condition).dot
    const dotColor = this.getColor(condition).dot
    return `${url}${dotColor}-dot.png`;
  }

  deleteElement(element: any){
    this.isClient(element) ? this.filter.removeClient(element) : this.filter.removeSpecialist(element) }

  ngOnDestroy(){
    this.sMarkersSubs?.unsubscribe();
    this.cMarkersSubs?.unsubscribe();
    this.allMarkersSubs?.unsubscribe();
  }

  filterForCompany(client: IClient){}
}
