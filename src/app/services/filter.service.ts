import { Injectable, OnInit } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, Subscription } from 'rxjs';
import { IClient, ISFilter, ISpecialist } from '../interfaces/interfaces';
import { ExcelService } from './excel.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService implements OnInit {

  constructor(private _excel : ExcelService, private helper: HelperService) { }

  public excelData : ISpecialist[] = [];
  public excelDataSubscription !: Subscription;

  public specialists$ = this._excel.getSubj();
  public filterSubject$ = new ReplaySubject<ISFilter>();

  ngOnInit(): void {
    this.excelDataSubscription = this._excel.getAll().subscribe(val =>
      this.excelData = val);
  }

  /**
   * Metodo per settare il filterSubject(cioè il filtro)
   * @param filterJson
   */
  public setFilter(filterJson : ISFilter) {
    this.filterSubject$.next(filterJson);
  }

  /**
   * Metodo che ci ritorna il filterSubject
   * @returns
   */
  public getFilter() {
    return this.filterSubject$;
  }

  dateBuilder(dateString: string){
    const [day,month,year] = dateString.split('/');
    return new Date(Number(`20${year}`), Number(month)-1, Number(day));
  }

  filterForCompany(arr: ISpecialist[], company: IClient) : ISpecialist[]{
    let cityFilter = null;
    // if (!company.remoteOption){
    //   const latLng1 = new google.maps.LatLng(company.latitude, company.longitude);
    //   const latLng2 = new google.maps.LatLng(company.latitude, company.longitude)
    //   this.helper.distanceCalc(latLng1, latLng2)
    // }
    let filt: ISFilter = {
      name : null,
      city : cityFilter,
      canMove : null,
      degree : [],
      skill : [],
      interests : company.lookFor,
      available_from : ["", company.available_from],
      notice : company.notice
    }
    return this.sFilter(arr, filt);
  }

  sFilter(arr: ISpecialist[], filt: ISFilter) : ISpecialist[]{
  let result = arr;
  for (const [key, value] of Object.entries(filt)) {
    if (value === null) { continue }
    let keyName = key as keyof ISpecialist
    if (Array.isArray(value)) {
      if (key === 'available_from'){
                
        const startDate = this.dateBuilder(value[0]);
        const endDate = this.dateBuilder(value[1]);
        let newArr: ISpecialist[] = []
        result.map( (element: any) =>
        {   
            const date = this.dateBuilder(element[keyName]);
            // if (date >= startDate && date <= endDate){
            if (date <= endDate) {
                newArr.push(element);
            };
        })
        result = newArr;
        continue
      }
      result = result.filter((element: any) =>
        value.some(el => element[keyName].includes(el)))
      continue
    };
    if (key === 'city') {
      result = result.filter(element =>
        element.canMove || element.city === value)
      continue
    }
    if (key === 'notice') {
    //   result = result.filter(element =>
    //     element.notice > value)
      continue
    }
    else {
      result = result.filter(element =>
        element[keyName] === value)
    }
    }
    return result
  }
  
  public filterData() : Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.filterSubject$])
     .pipe(map(([specialist, filterValue]) => this.sFilter(specialist, filterValue)))
   }

}
