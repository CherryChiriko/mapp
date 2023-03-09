import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
} from 'rxjs';
import {
  ICFilter,
  IClient,
  IRawClient,
  ISFilter,
  ISpecialist,
} from '../interfaces/interfaces';

import sData from 'src/assets/specialists.json';
import cData from 'src/assets/clients.json';
import { FormGroup } from '@angular/forms';
import { FormService } from './form.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  clientArray: IClient[] = [];
  specialistArray: ISpecialist[] = [];

  clients$ = new BehaviorSubject<IClient[]>([]);
  specialists$ = new BehaviorSubject<ISpecialist[]>([]);

  cFilterSubj$ = new ReplaySubject<ICFilter>(1);
  sFilterSubj$ = new ReplaySubject<ISFilter>(1);

  constructor(private form: FormService, private helper: HelperService) {


    /*this.clientArray = this.form.formatClientArr(cData);
    this.clients$.next(this.clientArray);
    this.specialistArray = this.form.formatSpecialistArr(sData);
    this.specialists$.next(this.specialistArray);*/
    this.resetAllFilters();

  }

  initSpecialist(specialist: ISpecialist[]) {
    this.specialistArray = this.form.formatSpecialistArr(specialist);
    this.specialists$.next(this.specialistArray);
    console.log(this.specialistArray);
  }

  initClient(client: IClient[]) {
    this.clientArray = this.form.formatClientArr(client);
    this.clients$.next(this.clientArray);
    console.log(this.clientArray);

  }

  getClients(): IClient[] {    return this.clientArray;  }
  getSpecialists(): ISpecialist[] {    return this.specialistArray;  }

  resetCFilter() {
    this.setCFilter( {
      name: null,
      bm: null,
      activities: null,
      need: null
    });
  }
  resetSFilter() {
    this.setSFilter( {
      id: null,
      bm: null,
      mobility: null,
      interests: null,
      experience: null,
      date: null
    });
  }
  resetAllFilters() {
    this.resetCFilter();
    this.resetSFilter();
  }

  addClient(newClient: IClient) {
    if (this.checkClient(newClient.name, newClient.city)) {
      alert(`Client ${newClient.name} is already present in ${newClient.city}`);
    } else {
      this.clientArray.push(newClient);
      this.clients$.next(this.clientArray);
    }
  }
  addSpecialist(newSpecialist: ISpecialist) {
    if (this.checkSpecialist(newSpecialist.id)) {
      alert(`Consultant with ID ${newSpecialist.id} is already present`);
    } else {
      this.specialistArray.push(newSpecialist);
      this.specialists$.next(this.specialistArray);
      console.log(this.specialistArray);

    }
  }

  checkClient(name: string, city: string): boolean {
    let matchClient = this.clientArray.find((client) => name === client.name);
    return matchClient?.city === city ? true : false;
  }
  checkSpecialist(id: string): boolean {
    let matchUser = this.specialistArray.find((spec) => id === spec.id);
    return matchUser ? true : false;
  }


  removeClient(client: IClient) {
    this.helper.removeElement(client, this.clientArray);
    this.clients$.next(this.clientArray);
  }
  removeSpecialist(specialist: ISpecialist) {
    this.helper.removeElement(specialist, this.specialistArray);
    this.specialists$.next(this.specialistArray);
  }

  setSFilter(filt: ISFilter) {
    this.sFilterSubj$.next(filt);
  }
  setCFilter(filt: ICFilter) {
    this.cFilterSubj$.next(filt);
  }

  getClient(clientName: string){
    return this.clientArray.find(c => c.name === clientName)
  }
  setActive(client: IClient, activity: string){
    const c = this.getClient(client.name)
    if (!c) {return;}
    if (c.need === activity) {c.need = ''; return;}
    c.need = activity;
  }

  createFilter(filter: any, isClient: boolean) {
    if (!filter) {return;}
    const val = filter;

    console.log(val)
    const activityName = isClient? "activities" : "interests";

    const activitiesArr : string[] = this.form.convertToArray(val, activityName);
    // console.log(val.regions, val, this.form.convertToArray(val, 'mobility'))
    const checkedRegions: string[] | null = !isClient? this.form.convertToArray(val, 'mobility'): null;
    // const regionsArr : string[] =    this.form.getRegions(val, checkedRegions);
    const date = this.helper.addDays(val.date);

    console.log('regions ', val.regions, 'date', val.date)
    console.log('second date ', date)

    if (isClient){
      let clientFilter: ICFilter = {
        name: val.name,
        bm: val.bm,
        activities: activitiesArr,
        need: val.need
      }
      console.log(clientFilter)
      this.setCFilter(clientFilter);
    }
    else {
      let specialistFilter: ISFilter = {
        id: val.id,
        bm: val.bm,
        mobility: checkedRegions,
        interests: activitiesArr,
        experience: val.experience,
        date: val.date
      }
      console.log(specialistFilter)
      this.setSFilter(specialistFilter);
    }
  }

  //                 Filter logic


  filterSingleValue(arr: Object[], value: string, key: string): Object[]{
    let reg = new RegExp(value, 'i');
    return arr.filter((element: any) => reg.test(element[key]));
  }
  filterArray(arr: Object[], value: string[], key: string, condition: boolean): Object[]{
    if (!value.length) { return arr; }
    return arr.filter((element: any) =>
    value.some((el: any) => element[condition? 'need' : key].includes(el))
    );
  }

  filterDates(arr: Object[], value: number){
    return arr.filter((element: any) => {
      // if (element.notice) {} else {
      // console.log(this.helper.stringToDate(element['available_from']) > this.helper.addDays(value)  )}
      element['notice'] ?  element.notice <= value :
      this.helper.stringToDate(element['available_from']) <= this.helper.addDays(value)
    })
  }
  filterNumbers(arr: Object[], value: number, key: string,){
    switch(true){
      case (key === 'experience') : return arr.filter((element: any) => element.experience >= value );
      case (key === 'date') : {
          this.filterDates(arr, value);
          return arr;
      };
      default : return arr;
    }
  }

  filterLogic(arr: any[], filt: any, isClient: boolean){
    if (!filt) {      return arr;    }
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      const keyName = (isClient? key as keyof ICFilter: key as keyof ISFilter);
      switch (true) {
        case (value === null || keyName === 'need') :{ break; }
        case Array.isArray(value): {
          const condition : boolean = (key === 'activities' && (filt as any).need)
          result = this.filterArray(result, value as string[], keyName, condition);
          break;
        }
        case ( typeof(value) === 'number' ): {
          // result = this.filterNumbers(result, value as number, keyName)
          break;
        }
        default: {
          result = this.filterSingleValue(result, value as string, keyName);
          break;
        }
      }}
    return result;
  }
  filterByCity(arr: any[], cityName: string) {
    return arr.filter((element) => element.city === cityName);
  }

  //                 Return filter

  filterData(isClient: boolean) : Observable<any>{
    const [bhvr, rep] = isClient? [this.clients$, this.cFilterSubj$] : [this.specialists$, this.sFilterSubj$]
    return combineLatest([bhvr, rep]).pipe(map(
      ([client, filterValue]) => this.filterLogic(client, filterValue, isClient))
    );
  }

}
