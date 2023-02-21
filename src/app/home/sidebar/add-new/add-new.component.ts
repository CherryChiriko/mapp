import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICity, IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
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
  
  specialistForm !: FormGroup;
  clientForm!: FormGroup;
  
  cityError: boolean = false;
  dateError: boolean = false;
  

  constructor(private filter : FilterService, private form: FormService){}

  ngOnInit(): void {
    this.clientForm = new FormGroup({ 
      city: new FormControl(null, [Validators.required]),
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
      city: new FormControl(null, [Validators.required]),
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

    let cityInfo: string[] = val.city.split(",");
    let [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);

    const lookForArr : string[] = this.form.convertToArray(val, "lookFor");
    // let level : string[] = this.formatLabel(val.level)
    const date : Date = val.end? val.end : new Date();
    this.dateError = val.end ? false : true;

    let newClient: IClient = {
      name: val.name,
      city: `${cityInfo.join(", ")}`,
      region: cityInfo[1],
      activities: lookForArr,
      need: lookForArr,
      latitude: lat,
      longitude: lng
    }
    console.log(newClient)
    this.filter.addClient(newClient);
    this.clientForm.reset();
  }
  addSpecialist(){
    const val = this.specialistForm.value;

    let cityInfo: string[] = val.city.split(",");
    let [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);
    
    const date : Date = val.end? val.end : new Date();
    this.dateError = val.end ? false : true;

    let interestsArr : string[] = this.form.convertToArray(val, "interests")
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties")

    let newSpecialist: ISpecialist = {
      id: "",
      name: val.name,
      email: val.email,
      phone: val.phone,
      city: `${cityInfo.join(", ")}`,
      region: cityInfo[1],
      experience: 0,
      degree: val.degree,
      interests: interestsArr,
      available_from: this.form.formatDate(date),
      notice: val.end ? this.form.daysBetween(val.start, date) : 0,
      latitude: lat,
      longitude: lng,
      mobility: ["false"]
    }
    console.log(newSpecialist)
    this.filter.addSpecialist(newSpecialist);
    this.specialistForm.reset();
  }

  add(){    this.isClient? this.addClient() : this.addSpecialist()}

  formatLabel(value: number): string {
    switch(value){
      case 0: return "No experience";
      case 1: return "Some experience";
      case 2: return "Technical high school";
      case 3: return "Bachelor degree";
      case 4: return "Master degree";
      case 5: return "Mid";
      case 6: return "Senior";
    }
    return "";
  }
}
