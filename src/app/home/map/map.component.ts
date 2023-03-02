import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { combineLatest, Subscription } from 'rxjs';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FavoriteListService } from 'src/app/services/favorite-list.service';
import { FilterService } from 'src/app/services/filter.service';
import { HelperService } from 'src/app/services/helper.service';


const INITIAL_COORDS = [41.9028, 12.4964]; // Roma

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  specialists: ISpecialist[] = [];
  clients: IClient[] = [];
  allMarkers: any[] = [];
  favoriteSpecialist : ISpecialist[] = [];

  sMarkersSubs?: Subscription;
  cMarkersSubs?: Subscription;
  allMarkersSubs?: Subscription;
  favoriteSpecialistSubs?: Subscription;

  showClients: boolean = true;
  showSpecialists: boolean = true;
  showNeed: boolean = true;
  isStarFull: boolean = false;



  center: google.maps.LatLngLiteral = {
    lat: INITIAL_COORDS[0],
    lng: INITIAL_COORDS[1],
  };
  zoom = 5;

  contacts: boolean[] = [];

  constructor(
    private filter: FilterService,
    private helper: HelperService,
    private _favorite : FavoriteListService
  ) {}


  ngOnInit() {
    
    this.cMarkersSubs = this.filter
      .filterData(true)
      .subscribe((value) => (this.clients = value));

    this.sMarkersSubs = this.filter
      .filterData(false)
      .subscribe((value) => (this.specialists = value));  

    this.allMarkersSubs = combineLatest([
      this.filter.filterData(true),
      this.filter.filterData(false),
    ]).subscribe(
      ([clients, specialists]) =>
        (this.allMarkers = [...clients, ...specialists])
    );
    this.favoriteSpecialistSubs = this._favorite
    .getFavoriteList()
    .subscribe(val => {
      this.favoriteSpecialist = val;
    });
  }

  cToggleShow() {    this.showClients = !this.showClients;  }
  sToggleShow() {    this.showSpecialists = !this.showSpecialists;  }
  nToggleShow() {    this.showNeed = !this.showNeed;  }
  getActiveClients() {  return this.clients.filter(client => client.need)}
  getInactiveClients() {  return this.clients.filter(client => !client.need)}

  showMarkers() {
    if (this.showClients && this.showSpecialists && this.showNeed) { return this.allMarkers }
    else {
      if (this.showClients) {
        return this.showNeed ? this.clients : 
        this.showSpecialists?  [...this.getInactiveClients(), ...this.specialists] : this.getInactiveClients()
      }
      if (this.showSpecialists){
        return this.showNeed? [...this.getActiveClients(), ...this.specialists] : this.specialists
      }
      return this.showNeed ? this.getActiveClients() : []
    } 
  }


 infoWindows: any[] = [];
 map !: google.maps.Map;

 openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
  this.infoWindows.forEach((w) => w.close());
  this.infoWindows = [infoWindow];
  infoWindow.open(marker);
  }

  isClient(element: IClient | ISpecialist) {    return !element.hasOwnProperty('id');  }
  isActive(element: any) {    return this.isClient(element)? element.need : null }

  getIcon(condition: boolean, need: boolean = false) {    return this.helper.getIcon(condition, need);  }

  ngOnDestroy() {
    this.sMarkersSubs?.unsubscribe();
    this.cMarkersSubs?.unsubscribe();
    this.allMarkersSubs?.unsubscribe();
  }
}
