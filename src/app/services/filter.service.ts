import { Injectable, OnInit } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ISFilter, ISpecialist } from '../interfaces/interfaces';
import { ExcelService } from './excel.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService implements OnInit {

  constructor(private _excel : ExcelService) { }

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

  sFilter(arr: ISpecialist[], filt: ISFilter) : ISpecialist[]{
  let result = arr;
  for (const [key, value] of Object.entries(filt)) {
    if (value === null) { continue }
    let keyName = key as keyof ISpecialist
    if (Array.isArray(value)) {
      if (key === 'Disponibilita_dal'){
                
        const startDate = this.dateBuilder(value[0]);
        const endDate = this.dateBuilder(value[1]);
        let newArr: ISpecialist[] = []
        result.map( element =>
        {   
            const date = this.dateBuilder(element[key]);
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
    if (key === 'Domicilio') {
      result = result.filter(element =>
        element.Disp_Trasferimento || element.Domicilio === value)
      continue
    }
    if (key === 'Preavviso') {
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
