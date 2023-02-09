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

  sFilter(arr: ISpecialist[], filt: ISFilter) {
  let result = arr;
  for (const [key, value] of Object.entries(filt)) {
    if (value === null) { continue }
    if (Array.isArray(value)) {
      // result = result.filter(element =>
      //   value.some(el => element[key].includes(el)))
      continue
    };
    if (key === 'Domicilio') {
      result = result.filter(element =>
        element.Disp_Trasferimento || element.Domicilio === value)
      continue
    }
    // if (key === 'notice') {
    //   result = result.filter(element =>
    //     element.notice > value)
    //   continue
    // }
    else {
      // result = result.filter(element =>
      //   element[key] === value)
    }
    }
    return result
  }
  
  public filterData() : Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.filterSubject$])
     .pipe(
     map(([specialist, filterValue]) => {
       return specialist.filter((spec) => {
         return(
           (spec.Nome === filterValue.Nome || !filterValue.Nome) &&
           (spec.Domicilio === filterValue.Domicilio || !filterValue.Domicilio)
          // && (spec.Studi === filterValue.Studi || !filterValue.Studi) &&
          //  (spec.Competenza_Princ === filterValue.Competenza_Princ || !filterValue.Competenza_Princ)
         );
       })
   })
   )
   }

}
