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

  getRegions(arr: any){
    let regionArr: string[] = [];
    arr.map((macroregion: any) => {
      let regions = macroregion.regions
      regions.map( (region: string) => regionArr.push(region))
    })
    return regionArr;
  }

  formatSpecialist(sData: any[]): ISpecialist[]{
    let specialists : ISpecialist[] = [];
    sData.map( s => 
      {
        specialists.push({
        name: s.name,
        id: s.id,
        email: s.email,
        phone: s.phone,
        city: s.city,
        region: "",
        avatar: "",
        experience: 0,
        degree: [],
        mobility: [],
        interests: [],
        available_from: "",
        notice: 0,
        latitude: 44.5075,
        longitude: 11.3514
      })
    }
    )
    // website
    return specialists;
  }
  formatClient(cData: any): IClient[]{
    let clients : IClient[] = [];
    cData.map( (c: any) => {
        clients.push( {
          name: c.name,
          city: c.city,
          region: "",
          logo: "",
          activities: [],
          need: [],
          latitude: 39.25,
          longitude: 9.05
        } )
      })
      console.log(clients)
      return clients;
  }
}
