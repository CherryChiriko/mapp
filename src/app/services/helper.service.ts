import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private datePipe: DatePipe) { }

  getColorScheme(condition: boolean, need : boolean = false){
    const color = need? 'yellow' : condition? 'red': 'blue';
    const but =  need? 'warning' : condition? 'danger': 'primary'
    return {
      color:      `var(--alten-${color})`,
      lightColor: `var(--light-alten-${color})`,
      darkColor:  `var(--dark-alten-${color})`,
      dot: `${color}`,
      button: `${but}`,
    }
  }
  getIcon(condition: boolean, need : boolean = false){
    const url = "http://maps.google.com/mapfiles/ms/icons/";
    const dotColor = need? 'yellow' : this.getColorScheme(condition).dot
    return `${url}${dotColor}-dot.png`;
  }
  getButton(condition:boolean, outline: boolean = false, need: boolean = false){
    const base = `btn-${this.getColorScheme(condition, need).button}`
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
  dateCompare(date1: Date, date2: Date): boolean{
    return date1.getTime() > date2.getTime()
  }

  formatDate(date: Date): string{
    return this.datePipe.transform(date,'dd/MM/YYYY')!;
  }
  stringToDate(dateString: string): Date{
    return new Date(Date.parse(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')));
  }

  removeElement(element: any, arr: any[]){
    const index = arr.indexOf(element)
    index > -1 ? arr.splice(index, 1): null;
  }

  selectAll(name: any[], arr: string[] ){
    for(var i=0; i < name.length; i++){
      if(name[i].type=='checkbox')  {
        name[i].checked=true;
        arr.push(name[i].value)
      }
    }
  }
}
