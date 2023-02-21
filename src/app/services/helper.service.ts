import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  // distanceCalc(latLng1: google.maps.LatLngLiteral, latLng2: google.maps.LatLngLiteral){
  //   var distance = google.maps.geometry.spherical.computeDistanceBetween(
  //     latLng1,
  //     latLng2
  //     );
  //   console.log(distance)  // answer is in meters
  // }
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
  getButton(condition:boolean){
    return `btn-${this.getColorScheme(condition).button}`
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
  
  dateBuilder(dateString: string) {
    const [day, month, year] = dateString.split('/');
    return new Date(Number(`20${year}`), Number(month) - 1, Number(day));
  }
  
}
