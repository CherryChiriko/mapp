import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import citiesData from 'src/assets/istat-cities.json';
import geoData from 'src/assets/italy_geo.json';
import { ICities, ICity, IClient, ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  cities : ICities[] = [] ;

  constructor(private datePipe: DatePipe) {
    this.cities = citiesData as ICities[];
  }

  addElementToFormGroup(form: FormGroup, category: string, array: string[]){
    array.forEach(item => {
      let abstractControl : AbstractControl = form.get(category)!;
      if(abstractControl instanceof FormGroup){
        (<FormGroup>abstractControl).addControl(item, new FormControl(null));
      }
    });
  }
  convertToArray(val: any, name:string){
    let arr : string[] = [];
    Object.keys(val[name]).forEach(function (key) {
      val[name][key] ? arr.push(key) : null;
    })
    return arr;
  }


  searchCity(expr: string){
    let reg = new RegExp(expr, "gi")
    let result = [{}];
    this.cities.map(city=> {
      city["Denominazione in italiano"].match(reg) ? result.push(
        {name: city["Denominazione in italiano"], region: city["Denominazione regione"], country: "Italy"}
        ): null;
      // result.length === this.cities.length ? result = [{}] : null;
    })
    console.log(result)
    return result;
  }
  getAllCities(){
    let result: ICity[] = [];
    this.cities.map(city=>
      result.push(
        {name: city["Denominazione in italiano"], region: city["Denominazione regione"], country: "Italy"}
        )
    )
    return result;
  }
  getCityCoordinates(cityName : string){
    const res = geoData?.find( element => element.comune === cityName);
    return [Number(res?.lat), Number(res?.lng)]
    // this.http.get(`${this.apiUrl}${cityName}`).subscribe(data => console.log("I Am ", data))
  }
  getCityInfo(cityName: string){
    return this.getAllCities()?.find( city => city.name === cityName)
  }


  // getRegionsArr(arr: any){
  //   let regionArr: string[] = [];
  //   arr.map((macroregion: any) => {
  //     let regions = macroregion.regions
  //     regions.map( (region: string) => regionArr.push(region))
  //   })
  //   return regionArr;
  // }
  // getRolesArr(arr: any){
  //   let rolesArr: string[] = [];
  //   arr.map((macroregion: any) => {
  //     let regions = macroregion.roles
  //     regions.map( (region: string) => rolesArr.push(region))
  //   })
  //   return rolesArr;
  // }
  getArr(arr: any, category: string){
    let newArr: string[] = []
    arr.map((element: any) => {
      let els = element[category]
      els.map( (el: string) => newArr.push(el))
    })
    return newArr
  }


  treatAsUTC(date: Date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return Number(date);
  }
  daysBetween(startDate: Date, endDate: Date) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  }
  formatDate(date: Date): string{
    return this.datePipe.transform(date,'dd/MM/YYYY')!;
  }

  formatClientArr(cData: any[]): IClient[]{
    let clients : IClient[] = [];
    cData.map( c => clients.push(this.formatClient(c)))
    return clients;
  }
  formatClient(c: any): IClient{
    const [lat, lng] = this.getCityCoordinates(c.city);
    const reg = this.getCityInfo(c.city)?.region;
    return {
      name: c.name,
      city: c.city,
      region: reg? reg : "",
      BM: c.bm,
      logo: c?.logo,
      activities: c.activities,
      need: c.need,
      latitude: lat,
      longitude: lng
    }
  }

  formatSpecialistArr(sData: any[]): ISpecialist[]{
    let specialists : ISpecialist[] = [];
    sData.map( s => specialists.push(this.formatSpecialist(s)))
    return specialists;
  }
  formatSpecialist(s: any): ISpecialist{
    const [lat, lng] = this.getCityCoordinates(s.city);
    const reg = this.getCityInfo(s.city)?.region;
    return {
      name: s.name,
      id: s.id,
      email: s.email,
      phone: s.phone,
      website: s.website? s.website: null,
      city: s.city,
      region: reg? reg: "",
      BM: s.bm,
      avatar: s.avatar? s.avatar: null,
      experience: s.experience,
      background: s.background,
      mobility: s.mobility,
      interests: s.interests,
      available_from: s.available_from ? s.available_from: null,
      notice: s.notice ? s.notice : null,
      latitude: lat,
      longitude: lng
    }
  }
}
