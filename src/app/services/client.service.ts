import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, Subscription } from 'rxjs';
import { IClient, ICFilter } from '../interfaces/interfaces';
import { ExcelService } from './excel.service';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientArray : IClient[] = [];
  public clientSubscription !: Subscription;

  public clients$ = this._excel.getClientSubject();
  public filterSubject$ = new ReplaySubject<ICFilter>(1);


  constructor(private _excel : ExcelService) {
    this.clientSubscription = this._excel.getAllClients().subscribe((val) =>
      this.clientArray = val
    );
   }

   public addClient(value : IClient) {
    this.clientArray.push(value);
    this.clients$.next(this.clientArray);
    console.log(this.clientArray);
   }

   public removeClient(value : IClient) {
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
  public setFilter(filterJson: ICFilter) {
    this.filterSubject$.next(filterJson);
  }

  /**
   * Metodo che ci ritorna il filterSubject
   * @returns
   */
  public getFilter() {
    return this.filterSubject$;
  }

  public dateBuilder(dateString: string) {
    const [day, month, year] = dateString.split('/');
    return new Date(Number(`20${year}`), Number(month) - 1, Number(day));
  }

  public sFilter(arr: IClient[], filt: ICFilter): IClient[] {
    let result = arr;
    for (const [key, value] of Object.entries(filt)) {
      if (value === null) {
        continue;
      }
      let keyName = key as keyof IClient;
      if (Array.isArray(value)) {
        if (key === 'available_from') {
          const startDate = this.dateBuilder(value[0]);
          const endDate = this.dateBuilder(value[1]);
          let newArr: IClient[] = [];
          result.map((element: any) => {
            const date = this.dateBuilder(element[keyName]);
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

  public filterData(): Observable<IClient[]> {
    return combineLatest([this.clients$, this.filterSubject$]).pipe(
      map(([client, filterValue]) => this.sFilter(client, filterValue))
    );
  }


}
