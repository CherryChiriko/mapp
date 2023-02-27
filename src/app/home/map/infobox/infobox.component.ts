import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FavoriteListService } from 'src/app/services/favorite-list.service';
import { FilterService } from 'src/app/services/filter.service';
import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent {
  @Input() mark!: any;
  @Input() totalMarkers!: any;
  
  isStarFull: boolean = false;
  showContacts: boolean = false;

  constructor(
    private form: FormService,
    private filter: FilterService,
    private helper: HelperService,
    private _favorite : FavoriteListService
  ) {}


  ngOnInit() {  }

  originalOrder = 
  (    a: KeyValue<string, string>,    b: KeyValue<string, string>  ): number => { return 0; };

  toggleContacts() {    this.showContacts = !this.showContacts;  }

  setContact() {
    // if (!this.contacts.length) {
    //   for (let i = 0; i < this.specialists.length; i++) {
    //     this.contacts.push(false);
    //   }
    // }
  }

  isClient(element: IClient | ISpecialist) {
    return !element.hasOwnProperty('id');
  }

  filterByCity(arr: any[], cityName: string) {
    return arr.filter((element) => element.city === cityName);
  }
  groupByCity(cityName: string): any[] {
    return this.filterByCity(this.totalMarkers, cityName);
  }

  markerInfo(condition: boolean, mark: any) {
    return this.form.getMarkerInfo(mark, condition);
  }

  getColor(condition: boolean) {    return this.helper.getColorScheme(condition);  }
  getIcon(condition: boolean) {    return this.helper.getIcon(condition);  }
  getButton(condition: boolean){ return this.helper.getButton(condition)}

  deleteElement(element: any) {
    this.isClient(element)
      ? this.filter.removeClient(element)
      : this.filter.removeSpecialist(element);
  }

  match(person: any){}
  filterForCompany(client: IClient) {}
  filterForSpecialist(specialist: ISpecialist) {}

  public addFavorite(item : ISpecialist) {
    this._favorite.addSpecialistFavorite(item);
    this.isStarFull = true;
  }

  public removeFavorite(item : ISpecialist) {
    this._favorite.removeFavoriteSpecialist(item);
    this.isStarFull = false;
  }

  // public getFavoriteList() : ISpecialist[]{
  //   return this.favoriteSpecialist;
  // }
}
