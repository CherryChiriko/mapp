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
   
    this.clientArray = this.form.formatClientArr(cData);
    this.clients$.next(this.clientArray);
    this.specialistArray = this.form.formatSpecialistArr(sData);
    this.specialists$.next(this.specialistArray);
    this.resetAllFilters();
    
  }

  initSpecialist(specialist: ISpecialist[]) {
    this.specialistArray = this.form.formatSpecialistArr(specialist);
    this.specialists$.next(this.specialistArray);
  }

  initClient(client: IClient[]) {
    this.clientArray = this.form.formatClientArr(client);
    this.clients$.next(this.clientArray);
  }

  getClients(): IClient[] {
    return this.clientArray;
  }
  getSpecialists(): ISpecialist[] {
    return this.specialistArray;
  }

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
      regions: null,
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
    const val = filter;
    // const interestsArr : string[] = this.form.convertToArray(val, "interests");
    const activitiesArr : string[] = this.form.convertToArray(val, "activities");
    // this.checkedRegions = [];
    const date = this.helper.addDays(val.date);

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
        regions: val.regions,
        interests: val.interests,
        experience: val.experience,
        date: date
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
  // processClientsAndSpecialists(arr: IClient[] | ISpecialist[]) {
  //   return 'need' in arr[0]? arr as ISpecialist[]: arr as IClient[];
  // }
  filterLogic(arr: any[], filt: any){
    if (!filt) {      return arr;    }
    // let result = this.processClientsAndSpecialists(arr);
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      const keyName = key as keyof IClient;
      if (value === null || keyName === 'need') { continue; }
      switch (true) {
        case Array.isArray(value): {
          const condition : boolean = (key === 'activities' && (filt as any).need)
          result = this.filterArray(result, value as string[], keyName, condition);
          break;
        }
        default: {
          result = this.filterSingleValue(result, value as string, keyName);
          break;
        }
      }}
    return result;
  }
  cFilterLogic(arr: IClient[], filt: ICFilter): IClient[] {
    // return this.filterLogic(arr, filt);
    return arr;

    // if (!filt) {      return arr;    }
    // let result = arr;
    // for (const [key, value] of Object.entries(filt)) {
    //   if (value === null) {        continue;      }
    //   let keyName = key as keyof IClient;
    //   if (keyName === 'need') {    continue;      }
    //   console.log('I am the result so far', result, keyName);
    //   switch (true) {
    //     case Array.isArray(value): {
    //       if (!value.length) { continue;  }
    //       if (keyName === 'activities' && filt.need) {
    //         result = result.filter((element: any) =>
    //         value.some((el: any) => element.need.includes(el))); 
    //         break;
    //       }
    //       result = result.filter((element: any) =>
    //       value.some((el: any) => element[keyName].includes(el))
    //       );
    //       break;
    //     }
    //     default: {
    //       let reg = new RegExp(value, 'i');
    //       result = result.filter((element: any) => reg.test(element[keyName]));
    //       console.log('and I am the result ', result);
    //       break;
    //     }
    //   }}
    // return result;
  }

  sFilterLogic(arr: ISpecialist[], filt: ISFilter): ISpecialist[] {
    if (!filt) {
      return arr;
    }
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {
        continue;
      }
      let keyName = key as keyof ISpecialist;
      // console.log('I am the result so far', result, keyName);
      if (Array.isArray(value)) {
        if (!value.length) {
          continue;
        }
        result = result.filter((element: any) =>
          value.some((el) => element[keyName].includes(el))
        );
        continue;
      } else {
        let reg = new RegExp(value, 'i');
        result = result.filter((element: any) => reg.test(element[keyName]));
        // if (keyName === 'city'){  result = [...result, ...arr.filter(element => element.canMove)]  }
        continue;
      }
    }
    return result;
  }
  filterByCity(arr: any[], cityName: string) {
    return arr.filter((element) => element.city === cityName);
  }

  //                 Return filter

  cFilterData(): Observable<IClient[]> {
    return combineLatest([this.clients$, this.cFilterSubj$]).pipe(
      map(([client, filterValue]) => this.filterLogic(client, filterValue))
    );
  }

  sFilterData(): Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.sFilterSubj$]).pipe(
      map(([specialist, filterValue]) =>
        this.sFilterLogic(specialist, filterValue)
      )
    );
  }
}
