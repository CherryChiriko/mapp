import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ICFilter, IClient, ISFilter, ISpecialist } from '../interfaces/interfaces';
import { ExcelService } from './excel.service';
import { HelperService } from './helper.service';

import sData from 'src/assets/data.json';
import cData from 'src/assets/clients.json';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  clientArray : IClient[] = [];
  specialistArray: ISpecialist[] = [];

  clientSubscription !: Subscription;
  specialistSubscription!: Subscription;

  clients$ = this._excel.getClientSubject();
  specialists$ = this._excel.getSpecialistsSubject();

  cFilterSub$ = new ReplaySubject<ICFilter>(1);
  sFilterSub$ = new ReplaySubject<ISFilter>(1);

  constructor(private _excel : ExcelService, private helper : HelperService) {
    // this.clientSubscription = this._excel.getAllClients().subscribe((val) =>
    //   this.clientArray = val
    // );
    this.clientArray = cData;
    this.clients$.next(this.clientArray);
    this.specialistArray = sData;
    this.specialists$.next(this.specialistArray);
    this.resetAllFilters();
    
  }


  resetCFilter(){
    const emptyFilter = {
      name: null,
      online: null,
      skills: null,
    }
    this.setCFilter(emptyFilter);
  }
  resetSFilter(){
    const emptyFilter = {
      name:  null,
      city: null,
      canMove: null,
      degree:  null,
      skills:  null,
      interests:  null,
      available_from:  null,
      notice: null,
    }
    this.setSFilter(emptyFilter);
  }
  resetAllFilters(){ this.resetCFilter(); this.resetSFilter();}
  
   addClient(value : IClient) {
    this.clientArray.push(value);
    this.clients$.next(this.clientArray);
    console.log(this.clientArray);
   }

   removeClient(value : IClient) {
    let index = this.clientArray.indexOf(value);
    if(index > -1) {
      this.clientArray.splice(index, 1);
    }
    this.clients$.next(this.clientArray);
   }

   /**
   * Metodo per settare il filterSubject(cioè il filtro)
   * @param filterJson
   */

  setSFilter(filt: ISFilter) {    this.sFilterSub$.next(filt);  }
  setCFilter(filt: ICFilter) {    this.cFilterSub$.next(filt);  }

  //                 Filter logic
  cFilterLogic(arr: IClient[], filt: ICFilter): IClient[] {
    console.log("Im")
    let result = arr;
    console.log(arr, result)
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {
        continue;
      }
      let keyName = key as keyof IClient;
      if (Array.isArray(value)) {
        if (key === 'available_from') {
          const startDate = this.helper.dateBuilder(value[0]);
          const endDate = this.helper.dateBuilder(value[1]);
          let newArr: IClient[] = [];
          result.map((element: any) => {
            const date = this.helper.dateBuilder(element[keyName]);
            // if (date >= startDate && date <= endDate){
            if (date <= endDate) {
              newArr.push(element);
            }
          });
          result = newArr;
          continue;
        }
        result = result.filter((element: any) =>
          value.some((el) => element[keyName].includes(el))
        );
        continue;
      }
      if (key === 'name') {
        result = result.filter(
          (element) => element.name || element.name === value
        );
        continue;
      }
    }
    
    return result;
    
  }

  sFilterLogic(arr: ISpecialist[], filt?: ISFilter): ISpecialist[] {
    if (!filt) {  return arr;}
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {   continue;    }            // if the entry in the filter is null, don't check for this
      let keyName = key as keyof ISpecialist;           // without this it doesn't work in TS (it does in standard JS)
      if (Array.isArray(value)) {                       // if it's an array
        if (key === 'available_from') {
          // const startDate = this.helper.dateBuilder(value[0]);
          const endDate = this.helper.dateBuilder(value[1]);
          let newArr: ISpecialist[] = [];
          result.map((element: any) => {
            const date = this.helper.dateBuilder(element[keyName]);
            // if (date >= startDate && date <= endDate){
            if (date <= endDate) {
              newArr.push(element);
            }
          });
          result = newArr;
          continue;
        }
        result = result.filter((element: any) =>
          value.some((el) => element[keyName].includes(el))
        );
        continue;
      }
      if (key === 'name') {
        result = result.filter(
          (element) => element.name || element.name === value
        );
        continue;
      }
    }
    return result;
  }

  //                 Return filter

  cFilterData(): Observable<IClient[]> {
    return combineLatest([this.clients$, this.cFilterSub$]).pipe(
      map(([client, filterValue]) => this.cFilterLogic(client, filterValue))
    );
  }

  sFilterData(): Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.sFilterSub$]).pipe(
      map(([specialist, filterValue]) => this.sFilterLogic(specialist, filterValue))
    )
  }
}
