import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import citiesData from 'src/assets/istat-cities.json';
import geoData from 'src/assets/italy_geo.json';
import { ICities, ICity, IClient, IRawClient, IRawSpecialist, ISpecialist } from '../interfaces/interfaces';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  cities : ICities[] = [] ;

  constructor(private helper: HelperService) {
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
  convertToNegativeArr(val: any){
    let arr : string[] = [];
    Object.keys(val.mobility).forEach(function (key) {
      val.mobility[key] === false ? arr.push(key) : null;
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
  }
  getCityInfo(cityName: string){
    return this.getAllCities()?.find( city => city.name === cityName)
  }
  getRegions(val: any, checkedRegions: string[]){
    const regionsToAdd: string[] = this.convertToArray(val, "mobility");
    const regionsToRemove: string[] = this.convertToNegativeArr(val);

    let arr: string[] = [...checkedRegions,...regionsToAdd];
    regionsToRemove.map( region =>
      this.helper.removeElement(region, arr)
    )
    return arr;
  }

  getArr(arr: any, category: string){
    let newArr: string[] = []
    arr.map((element: any) => {
      let els = element[category]
      els.map( (el: string) => newArr.push(el))
    })
    return newArr
  }


  formatClientArr(cData: IRawClient[]): IClient[]{
    let clients : IClient[] = [];
    cData.map( c => clients.push(this.formatClient(c)))
    return clients;
  }
  formatClient(c: IRawClient): IClient{
    const [lat, lng] = this.getCityCoordinates(c.city);
    const reg = this.getCityInfo(c.city)?.region;

    return {
      name: c.name,
      city: c.city,
      region: reg? reg : "",
      bm: c.bm,
      logo: c?.logo,
      activities: c.activities,
      need: c.need,
      latitude: lat,
      longitude: lng
    }
  }

  formatSpecialistArr(sData: IRawSpecialist[]): ISpecialist[]{
    let specialists : ISpecialist[] = [];
    sData.map( s => specialists.push(this.formatSpecialist(s)))
    return specialists;
  }
  formatSpecialist(s: IRawSpecialist): ISpecialist{
    const [lat, lng] = this.getCityCoordinates(s.city);
    const reg = this.getCityInfo(s.city)?.region;

    return {
      name: s.name,
      id: s.id,
      email: s.email,
      phone: s.phone,
      website: s.website? s.website: undefined,
      city: s.city,
      region: reg? reg: "",
      bm: s.bm,
      // avatar: s.avatar? s.avatar: undefined,
      experience: s.experience,
      background: s.background,
      mobility: s.mobility,
      interests:  s.interests,
      available_from: s.available_from ? s.available_from: undefined,
      notice: s.notice ? s.notice : undefined,
      latitude: lat,
      longitude: lng
    }
  }

  getMarkerInfo(mark: any, isClient: boolean){
    return isClient ?
    {"Activities" : mark.activities} :
    {"Interests" : mark.interests}
  }
}
