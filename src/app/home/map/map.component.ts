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
    private map: MapService,
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

  originalOrder = (
    a: KeyValue<string, string>,
    b: KeyValue<string, string>
  ): number => {
    return 0;
  };

  toggleContacts(i: number) {
    this.contacts[i] = !this.contacts[i];
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

  setContact() {
    if (!this.contacts.length) {
      for (let i = 0; i < this.specialists.length; i++) {
        this.contacts.push(false);
      }
    }
  }

 infoWindows: any[] = [];

 openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
  this.infoWindows.forEach((w) => w.close());
  this.infoWindows = [infoWindow];
  this.setContact();
  infoWindow.open(marker);
  }

  closeInfoWindow(infoWindow: MapInfoWindow) {
    infoWindow.close();
  }

  isClient(element: IClient | ISpecialist) {
    return !element.hasOwnProperty('id');
  }

  filterByCity(arr: any[], cityName: string) {
    return arr.filter((element) => element.city === cityName);
  }
  groupByCity(cityName: string): any[] {
    // let sGroup = this.filterByCity(this.specialists, cityName);
    // let cGroup = this.filterByCity(this.clients, cityName);
    // return [...cGroup, ...sGroup];
    return this.filterByCity(this.showMarkers(), cityName);
  }

  markerInfo(condition: boolean, mark: any) {
    return condition
      ? this.map.getCMarkerInfo(mark)
      : this.map.getSMarkerInfo(mark);
  }

  getColor(condition: boolean) {
    return this.helper.getColorScheme(condition);
  }
  getIcon(condition: boolean) {
    return this.helper.getIcon(condition);
  }

  deleteElement(element: any) {
    this.isClient(element)
      ? this.filter.removeClient(element)
      : this.filter.removeSpecialist(element);
  }

  ngOnDestroy() {
    this.sMarkersSubs?.unsubscribe();
    this.cMarkersSubs?.unsubscribe();
    this.allMarkersSubs?.unsubscribe();
  }

  filterForCompany(client: IClient) {}
  filterForSpecialist(specialist: ISpecialist) {}

  // public addPixel(){
  //   this.height += 50;
  //   this.width += 100;
  // }

  // public reducePixel(){
  //   this.height -= 50;
  //   this.width -= 100;
  // }

  public addFavorite(item : ISpecialist) {
    this._favorite.addSpecialistFavorite(item);
    this.isStarFull = true;
    console.log(this.isStarFull, this.favoriteSpecialist)
    // console.log(this.favoriteSpecialist);

  }

  public removeFavorite(item : ISpecialist) {
    this._favorite.removeFavoriteSpecialist(item);
    this.isStarFull = false;
    // console.log(this.favoriteSpecialist);

  }

  public getFavoriteList() : ISpecialist[]{
    return this.favoriteSpecialist;
  }
}
