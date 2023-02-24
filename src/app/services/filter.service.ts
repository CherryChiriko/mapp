import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, ReplaySubject } from 'rxjs';
import { ICFilter, IClient, ISFilter, ISpecialist } from '../interfaces/interfaces';

import sData from 'src/assets/specialists.json';
import cData from 'src/assets/clients.json';
import { FormGroup } from '@angular/forms';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService{

  clientArray: IClient[] = [];
  specialistArray: ISpecialist[] = [];

  clients$ = new BehaviorSubject<IClient[]>([]);
  specialists$ = new BehaviorSubject<ISpecialist[]>([]);

  cFilterSubj$ = new ReplaySubject<ICFilter>(1);
  sFilterSubj$ = new ReplaySubject<ISFilter>(1);

  constructor(private form: FormService) {



    this.clientArray = this.form.formatClientArr(cData);
    this.clients$.next(this.clientArray);
    this.specialistArray = this.form.formatSpecialistArr(sData);
    this.specialists$.next(this.specialistArray);
    this.resetAllFilters();
  }

  initSpecialist(specialist : ISpecialist[]) {
    this.specialistArray = this.form.formatSpecialistArr(specialist);
    this.specialists$.next(this.specialistArray);
  }

  initClient(client : IClient[]) {
    this.clientArray = this.form.formatClientArr(client);
    this.clients$.next(this.clientArray);
  }

  getClient() : IClient[] {    return this.clientArray;  }
  getSpecialist() : ISpecialist[]{    return this.specialistArray;  }

  resetCFilter() {
    const emptyFilter = {
      name: null,
      region: null,
      experience: null,
      lookFor: null,
      available_from: null,
      notice: null,
    };
    this.setCFilter(emptyFilter);
  }
  resetSFilter() {
    const emptyFilter = {
      name: null,
      region: null,
      mobility: null,
      degree: null,
      skills: null,
      interests: null,
      available_from: null,
      notice: null,
    };
    this.setSFilter(emptyFilter);
  }
  resetAllFilters() {    this.resetCFilter();    this.resetSFilter();  }

  addClient(newClient: IClient) {
    if(this.checkClient(newClient.name, newClient.city))
    {      alert("Client " + newClient.name + " is already present in " + newClient.city)    }
    else{
      this.clientArray.push(newClient);
      this.clients$.next(this.clientArray);
    }
  }

  addSpecialist(newSpecialist: ISpecialist) {
    if(this.checkSpecialist(newSpecialist.id)){
      alert("Consultant with ID " + newSpecialist.id + " is already present")
    }else{
    this.specialistArray.push(newSpecialist);
    this.specialists$.next(this.specialistArray);
    }
  }

  checkSpecialist(id : string) : boolean {
    let matchUser = this.specialistArray.find((spec) =>
    id === spec.id)
    if(matchUser){
      return true;
    }else{
      return false;
    }
  }

  checkClient(name : string, city : string) : boolean{
    let matchClient = this.clientArray.find((client) => name === client.name);
    if(matchClient?.city === city){
      return true;
    }else{
      return false;
    }
  }


  removeClient(client: IClient) {
    let index = this.clientArray.indexOf(client);
    if (index > -1) {
      this.clientArray.splice(index, 1);
    }
    this.clients$.next(this.clientArray);
  }
  removeSpecialist(specialist: ISpecialist) {
    let index = this.specialistArray.indexOf(specialist);
    if (index > -1) {
      this.specialistArray.splice(index, 1);
    }
    this.specialists$.next(this.specialistArray);
  }

  setSFilter(filt: ISFilter) {    this.sFilterSubj$.next(filt);  }
  setCFilter(filt: ICFilter) {    this.cFilterSubj$.next(filt);  }

  createFilter(filter: any, isClient: boolean){
    const val = filter;
    const degreeArr : string[] = this.form.convertToArray(val, "degree");
    const specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    const interestsArr : string[] = this.form.convertToArray(val, "interests");
    const regionsArr : string[] = this.form.convertToArray(val, "regions")
    const date = val.end? [this.form.formatDate(val.start),this.form.formatDate(val.end)]: null;

    if (isClient){
      let clientFilter: ICFilter = {
        name: val.name,
        region: regionsArr,
        experience: degreeArr,
        lookFor: specialtiesArr,
        // interests: interestsArr,
        available_from: date,
        notice: val.notice
      }
      console.log(clientFilter)
      this.setCFilter(clientFilter);
    }
    else {
      let specialistFilter: ISFilter = {
        name: val.name,
        region: regionsArr,
        mobility: null,
        degree: degreeArr,
        skills: specialtiesArr,
        interests: interestsArr,
        available_from: date,
        notice: val.notice
      }
      this.setSFilter(specialistFilter);
    }
  }

  //                 Filter logic

  cFilterLogic(arr: IClient[], filt: ICFilter): IClient[] {
    if (!filt) {      return arr;    }
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {        continue;      }
      let keyName = key as keyof IClient;
      // console.log('I am the result so far', result, keyName);
      if (Array.isArray(value)) {
        if (!value.length) {          continue;        }
        result = result.filter((element: any) =>
          value.some((el) => element[keyName].includes(el))
        );
        continue;
      } else {
        let reg = new RegExp(value, 'i');
        result = result.filter((element: any) => reg.test(element[keyName]));
        // console.log('and I am the result ', result);
        continue;
      }
    }
    return result;
  }


  sFilterLogic(arr: ISpecialist[], filt: ISFilter): ISpecialist[] {
    if (!filt) {      return arr;    }
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {        continue;      }
      let keyName = key as keyof ISpecialist;
      // console.log('I am the result so far', result, keyName);
      if (Array.isArray(value)) {
        if (!value.length) { continue; }
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

  //                 Return filter

  cFilterData(): Observable<IClient[]> {
    return combineLatest([this.clients$, this.cFilterSubj$]).pipe(
      map(([client, filterValue]) => this.cFilterLogic(client, filterValue))
    );
  }

  sFilterData(): Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.sFilterSubj$]).pipe(
      map(([specialist, filterValue]) =>
        this.sFilterLogic(specialist, filterValue))
    );
  }
}
