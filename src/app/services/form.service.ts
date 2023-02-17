import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import citiesData from 'src/assets/istat-cities.json';
import geoData from 'src/assets/italy_geo.json';
import { ICities, ICity } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  cities : ICities[] = [] ;
  // apiUrl : string = "";

  constructor(private datePipe: DatePipe) { 
    this.cities = citiesData as ICities[];
  }
  // constructor(private http: HttpClient) { 
  //   // this.http.get('src/assets/istat-cities.json').subscribe(values => {
  //   //   this.cities = values as ICities[]})
  //   this.cities = citiesData as ICities[];
  //   // this.apiUrl = "https://nominatim.openstreetmap.org/search?country=Italy,city="
  // }

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
  
}