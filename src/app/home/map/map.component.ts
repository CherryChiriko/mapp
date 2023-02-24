import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { combineLatest, Subscription } from 'rxjs';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FavoriteListService } from 'src/app/services/favorite-list.service';
import { FilterService } from 'src/app/services/filter.service';
import { HelperService } from 'src/app/services/helper.service';
import { MapService } from 'src/app/services/map.service';


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
  isStarFull: boolean = false;



  center: google.maps.LatLngLiteral = {
    lat: INITIAL_COORDS[0],
    lng: INITIAL_COORDS[1],
  };
  zoom = 5;

  // public height = 450;
  // public width = 750;

  contacts: boolean[] = [];

  constructor(
    private _map: MapService,
    private filter: FilterService,
    private helper: HelperService,
    private _favorite : FavoriteListService
  ) {}


  ngOnInit() {
    this.sMarkersSubs = this.filter
      .sFilterData()
      .subscribe((value) => (this.specialists = value));

    this.cMarkersSubs = this.filter
      .cFilterData()
      .subscribe((value) => (this.clients = value));

    this.allMarkersSubs = combineLatest([
      this.filter.sFilterData(),
      this.filter.cFilterData(),
    ]).subscribe(
      ([specialists, clients]) =>
        (this.allMarkers = [...clients, ...specialists])
    );
    this.favoriteSpecialistSubs = this._favorite
    .getFavoriteList()
    .subscribe(val => {
      this.favoriteSpecialist = val;
    });
  }




  cToggleShow() {
    this.showClients = !this.showClients;
  }
  sToggleShow() {
    this.showSpecialists = !this.showSpecialists;
  }
  showMarkers() {
    return this.showClients && this.showSpecialists
      ? this.allMarkers
      : this.showClients
      ? this.clients
      : this.showSpecialists
      ? this.specialists
      : [];
  }

 infoWindows: any[] = [];
 map !: google.maps.Map;

 openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
  this.infoWindows.forEach((w) => w.close());
  this.infoWindows = [infoWindow];
  infoWindow.open(marker);
  }

  isClient(element: IClient | ISpecialist) {
    return !element.hasOwnProperty('id');
  }

  getColor(condition: boolean) {
    return this.helper.getColorScheme(condition);
  }
  getIcon(condition: boolean) {
    return this.helper.getIcon(condition);
  }

  ngOnDestroy() {
    this.sMarkersSubs?.unsubscribe();
    this.cMarkersSubs?.unsubscribe();
    this.allMarkersSubs?.unsubscribe();
  }


  // public addPixel(){
  //   this.height += 50;
  //   this.width += 100;
  // }

  // public reducePixel(){
  //   this.height -= 50;
  //   this.width -= 100;
  // }
}
