import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICity, IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { FormService } from 'src/app/services/form.service';
import { MapService } from 'src/app/services/map.service';

import data from 'src/assets/specifics.json';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent {

  @Input() isClient!: boolean;

  specialArr: string[] = data.specialties;
  degArr: string[] = data.degrees;
  citiesArr: ICity[] = this.form.getAllCities();
  
  cityForm !: FormGroup;
  specialistForm !: FormGroup;
  clientForm!: FormGroup;
  
  cityError: boolean = false;
  dateError: boolean = false;
  

  constructor(private _excel : ExcelService, private map: MapService, private form: FormService){}

  ngOnInit(): void {
    this.cityForm = new FormGroup({
      city: new FormControl(null, [Validators.required])
    })

    this.clientForm = new FormGroup({ 
      name: new FormControl(null),
      website: new FormControl("", [Validators.pattern("https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}")]),
      picture: new FormControl(null),
      lookFor: new FormGroup({}),
      level: new FormGroup({}),
      online: new FormControl(null),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.specialistForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null, [Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      phone: new FormControl(null),
      degree: new FormControl(null),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      canMove: new FormControl(null),
    });

    this.form.addElementToFormGroup(this.clientForm, 'lookFor', this.specialArr)
    this.form.addElementToFormGroup(this.clientForm, 'level', ["0", "1", "2", "3", "4", "5", "6"])
    this.form.addElementToFormGroup(this.specialistForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.specialistForm, 'interests', this.specialArr)
  }

  addClient(){
    const val = this.clientForm.value;
    let cityInfo: string[];
    let lat: number; let lng: number;
    console.log(val.level)
    try{
      cityInfo = this.cityForm.value.city.split(",");
      [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);}
    catch{
      // this.formError = true; return;
    }
    cityInfo = ["ci", "ty"];
    [lat, lng] = [0,0];

    const lookForArr : string[] = this.form.convertToArray(val, "lookFor");
    // let level : string[] = this.formatLabel(val.level)
    const date : Date = val.end? val.end : new Date();
    this.dateError = val.end ? false : true;

    let newClient: IClient = {
      name: val.name,
      website: val.website,
      city: `${cityInfo.join(", ")}`,
      remoteOption: val.online,
      lookFor: lookForArr,
      level: [""],
      // level: val.level,
      available_from: this.form.formatDate(date),
      notice: val.end? this.form.daysBetween(val.start, date): 0,
      latitude: lat,
      longitude: lng
    }
    console.log(newClient)
    this.map.addCMarker(newClient);
  }
  addSpecialist(){
    const val = this.specialistForm.value;
    
    let cityInfo: string[];
    let lat: number; let lng: number;
    try{
      cityInfo = this.cityForm.value.city.split(",");
      [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);}
    catch{
      // this.formError = true; return;
    }
    cityInfo = ["ci", "ty"];
    [lat, lng] = [0,0];

    const date : Date = val.end? val.end : new Date();
    this.dateError = val.end ? false : true;

    let interestsArr : string[] = this.form.convertToArray(val, "interests")
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties")

    let newSpecialist: ISpecialist = {
      name: val.name,
      email: val.email,
      phone: val.phone,
      city: `${cityInfo.join(", ")}`,
      canMove: val.canMove,
      degree: val.degree,
      skills: specialtiesArr,
      interests: interestsArr,
      available_from: this.form.formatDate(val.end),
      notice: this.form.daysBetween(val.start, val.end),
      latitude: lat,
      longitude: lng
    }
    console.log(newSpecialist)
    this.map.addSMarker(newSpecialist);
    // this._excel.addCity(newSpecialist);
  }
  add(){    this.isClient? this.addClient() : this.addSpecialist()}

  formatLabel(value: number): string {
    switch(value){
      case 0: return "No experience";
      case 1: return "Some experience";
      case 2: return "Technical high school";
      case 3: return "Bachelor degree";
      case 4: return "Master degree";
      case 5: return "Mid developer";
      case 6: return "Senior developer";
    }
    return "";
  }
}
