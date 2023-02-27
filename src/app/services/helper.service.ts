import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private datePipe: DatePipe) { }

  getColorScheme(condition: boolean){
    const color = condition? 'red': 'blue';
    const but = condition? 'danger': 'primary'
    return {
      color:      `var(--alten-${color})`,
      lightColor: `var(--light-alten-${color})`,
      darkColor:  `var(--dark-alten-${color})`,
      dot: `${color}`,
      button: `${but}`,
    } 
  }
  getIcon(condition: boolean){
    const url = "http://maps.google.com/mapfiles/ms/icons/";
    const dotColor = this.getColorScheme(condition).dot
    return `${url}${dotColor}-dot.png`;
  }
  getButton(condition:boolean, outline: boolean = false){
    const base = `btn-${this.getColorScheme(condition).button}`
    return outline? `${base}-outline`: base;
  }
  // groupArray<T, K>(arr: T[], getKey: (el: T) => K): Map<K, T[]> {
  //   const map = new Map<K, T[]>;
  //   for (const el of arr) {
  //     const key: K = getKey(el);
  //     let group: T[] | undefined = map.get(key); 
  //     if (!group) {
  //       group = [];
  //     }
  //     group.push(el);
  //     map.set(key, group);
  //   }
  //   return map;
  // }


  // treatAsUTC(date: Date) {
  //   date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  //   return Number(date);
  // }
  // daysBetween(startDate: Date, endDate: Date) {
  //     var millisecondsPerDay = 24 * 60 * 60 * 1000;
  //     return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  // }
  // dateBuilder(dateString: string) {
  //   const [day, month, year] = dateString.split('/');
  //   return new Date(Number(`20${year}`), Number(month) - 1, Number(day));
  // }

  addDays(days: number) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  formatDate(date: Date): string{
    return this.datePipe.transform(date,'dd/MM/YYYY')!;
  }

  removeElement(element: any, arr: any[]){  
    const index = arr.indexOf(element)
    index > -1 ? arr.splice(index, 1): null; 
  }

}
