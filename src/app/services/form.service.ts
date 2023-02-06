import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import citiesData from 'src/assets/istat-cities.json';
import { ICities } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  
  cities : ICities[] = [] ;
  constructor(private http: HttpClient) { 
    // this.http.get('src/assets/istat-cities.json').subscribe(values => {
    //   this.cities = values as ICities[]})
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
    })
    console.log(result)
    // console.log(this.cities)
    // console.log(this.cities[0]["Denominazione in italiano"])
  }
    // console.log(citiesData["Codice Regione"])
  
}
// .map(city=> city["Denominazione in italiano"])