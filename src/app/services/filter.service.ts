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
  public filterSubject$ = new ReplaySubject<ISpecialist>(1);

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

  public filterData() : Observable<ISpecialist[]> {
    return combineLatest([this.specialists$, this.filterSubject$])
     .pipe(
     map(([specialist, filterValue]) => {
       return specialist.filter((spec) => {
         return(
           (spec.Nome === filterValue.Nome || !filterValue.Nome) &&
           (spec.Domicilio === filterValue.Domicilio || !filterValue.Domicilio) &&
           (spec.Studi === filterValue.Studi || !filterValue.Studi) &&
           (spec.Competenza_Princ === filterValue.Competenza_Princ || !filterValue.Competenza_Princ)
         );
       })
   })
   )
   }





}
