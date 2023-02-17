import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {
  ICFilter,
  IClient,
  ISFilter,
  ISpecialist,
} from '../interfaces/interfaces';
import { ExcelService } from './excel.service';
import { HelperService } from './helper.service';

import sData from 'src/assets/specialists.json';
import cData from 'src/assets/clients.json';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  clientArray: IClient[] = [];
  specialistArray: ISpecialist[] = [];

  clientSubs!: Subscription;
  specialistSubs!: Subscription;

  //clients$ = this._excel.getClientSubject();
  //specialists$ = this._excel.getSpecialistsSubject();
  clients$ = new BehaviorSubject<IClient[]>([]);
  specialists$ = new BehaviorSubject<ISpecialist[]>([]);

  cFilterSubj$ = new ReplaySubject<ICFilter>(1);
  sFilterSubj$ = new ReplaySubject<ISFilter>(1);

  constructor(private _excel: ExcelService, private helper: HelperService) {
    this.specialistSubs = this._excel.getAllSpecialists().subscribe((val) => {
      this.specialistArray = val;
      this.specialists$.next(this.specialistArray);
    });
    this.clientSubs = this._excel.getAllClients().subscribe((val) => {
      this.clientArray = val;
      this.clients$.next(this.clientArray);
    });
    this.resetAllFilters();

    /*
    this.clientArray = cData;
    this.clients$.next(this.clientArray);
    this.specialistArray = sData;
    this.specialists$.next(this.specialistArray);

    this.resetAllFilters();
     */
  }

  resetCFilter() {
    const emptyFilter = {
      name: null,
      online: null,
      city: null,
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
      city: null,
      canMove: null,
      degree: null,
      skills: null,
      interests: null,
      available_from: null,
      notice: null,
    };
    this.setSFilter(emptyFilter);
  }
  resetAllFilters() {
    this.resetCFilter();
    this.resetSFilter();
  }

  addClient(newClient: IClient) {
    this.clientArray.push(newClient);
    this.clients$.next(this.clientArray);
  }
  addSpecialist(newSpecialist: ISpecialist) {
    this.specialistArray.push(newSpecialist);
    this.specialists$.next(this.specialistArray);
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

  setSFilter(filt: ISFilter) {
    this.sFilterSubj$.next(filt);
  }
  setCFilter(filt: ICFilter) {
    this.cFilterSubj$.next(filt);
  }

  //                 Filter logic

  cFilterLogic(arr: IClient[], filt: ICFilter): IClient[] {

    if (!filt) {      return arr;    }
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {        continue;      }
      let keyName = key as keyof IClient;
      console.log('I am the result so far', result, keyName);
      if (Array.isArray(value)) {        
        if (!value.length) {          continue;        }
        result = result.filter((element: any) =>
          value.some((el) => element[keyName].includes(el))
        );
        continue;
      } else {
        let reg = new RegExp(value, 'i');
        result = result.filter((element: any) => reg.test(element[keyName]));
        console.log('and I am the result ', result);
        continue;
      }
    }
    console.log('I am the filter ', filt);
    console.log(      'I am the original ',      arr.map((el) => el.name)    );
    console.log(      'I am filtered ',      result.map((el) => el.name)    );
    return result;
  }

  // sFilterLogic(arr: ISpecialist[], filt?: ISFilter): ISpecialist[] {
  //   if (!filt) { return arr;}
  //   let result = arr;
  //   console.log(result, arr)
  //   for (const [key, value] of Object.entries(filt)) {
  //     if (value === null) {   continue;    }            // if the entry in the filter is null, don't check for this
  //     let keyName = key as keyof ISpecialist;           // without this it doesn't work in TS (it does in standard JS)
  //     if (Array.isArray(value)) {                       // if it's an array
  //       // if (key === 'available_from') {
  //       //   // const startDate = this.helper.dateBuilder(value[0]);
  //       //   const endDate = this.helper.dateBuilder(value[1]);
  //       //   let newArr: ISpecialist[] = [];
  //       //   result.map((element: any) => {
  //       //     const date = this.helper.dateBuilder(element[keyName]);
  //       //     // if (date >= startDate && date <= endDate){
  //       //     if (date <= endDate) {
  //       //       newArr.push(element);
  //       //     }
  //       //   });
  //       //   result = newArr;
  //       //   continue;
  //       // }
  //       result = result.filter((element: any) =>
  //         value.some((el) => element[keyName].includes(el))
  //       );
  //       continue;
  //     }
  //     else {
  //       let reg = new RegExp(value, "i");
  //       result = result.filter(
  //           (element: any) => reg.test(element[keyName])
  //           )
  //     continue;
  //     }
  //   }
  //   console.log("I am the filter ", filt)
  //   console.log("I am the original ", arr)
  //   console.log("I am filtered ", result)
  //   return result;
  // }

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
        if (keyName === 'city'){  result = [...result, ...arr.filter(element => element.canMove)]  }
        continue;
      }
    }
    console.log('I am the filter ', filt);
    console.log(      'I am the original ',      arr.map((el) => el.name)    );
    console.log(      'I am filtered ',      result.map((el) => el.name)    );
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
        this.sFilterLogic(specialist, filterValue)
      )
    );
  }

  ngOnDestroy() {
    this.clientSubs?.unsubscribe();
    this.specialistSubs?.unsubscribe();
  }
}
