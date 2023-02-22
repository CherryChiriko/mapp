import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICity, IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

import data from 'src/assets/specifics.json';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent {

  @Input() isClient!: boolean;
  
  citiesArr: ICity[] = this.form.getAllCities();
  BMs: string[] = data.BMs;
  rolesArr: any = data.activities;
  degArr: string[] = data.degrees;
  
  specialistForm !: FormGroup;
  clientForm!: FormGroup;
  
  resultMessage: string = '';
  // cityError: boolean = false;
  // dateError: boolean = false;
  

  constructor(private filter : FilterService, private form: FormService, private helper: HelperService){}

  ngOnInit(): void {
    this.clientForm = new FormGroup({ 
      city: new FormControl(null, [Validators.required]),
      name: new FormControl(null),
      bm: new FormControl(null),
      picture: new FormControl(null),
      activities: new FormGroup({}),
      need: new FormGroup({}),
    });

    this.specialistForm = new FormGroup({
      city: new FormControl(null, [Validators.required]),
      name: new FormControl(null),
      id: new FormControl(null),
      bm: new FormControl(null),

      website: new FormControl("", [Validators.pattern("https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}")]),
      email: new FormControl(null, [Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      phone: new FormControl(null),
      
      background: new FormGroup({}),
      interests: new FormGroup({}),
      mobility: new FormGroup({}),
      start: new FormControl<Date | null | number>(null)
    });

    this.form.addElementToFormGroup(this.clientForm, 'bm', this.BMs)
    this.form.addElementToFormGroup(this.clientForm, 'activities', this.rolesArr)
    this.form.addElementToFormGroup(this.clientForm, 'need', this.rolesArr)

    this.form.addElementToFormGroup(this.specialistForm, 'bm', this.BMs)
    this.form.addElementToFormGroup(this.specialistForm, 'background', this.degArr)    
    this.form.addElementToFormGroup(this.specialistForm, 'interests', this.rolesArr)    
    // this.form.addElementToFormGroup(this.specialistForm, 'mobility', this.form.getRegionsArr())
  }

  addClient(){
    const val = this.clientForm.value;
    let cityInfo: string[] = val.city.split(",");

    // const lookForArr : string[] = this.form.convertToArray(val, "lookFor");

    let newClient = {
      name: val.name,
      logo: val.picture,
      city: cityInfo[0],
      BM: val.bm,
      activities: val.activities,
      need: val.need
    }
    console.log(newClient)
    this.filter.addClient(this.form.formatClient(newClient));
    this.clientForm.reset();
  }
  addSpecialist(){
    const val = this.specialistForm.value;
    let cityInfo: string[] = val.city.split(",");

    let newSpecialist = {
      name: val.name,
      id: val.id,
      city: cityInfo[0],
      BM: val.bm,
      email: val.email,
      phone: val.phone,
      website: val.website
    }
    console.log(newSpecialist)
    this.filter.addSpecialist(this.form.formatSpecialist(newSpecialist));
    this.clientForm.reset();

    // 
    // let [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);
    
    // const date : Date = val.end? val.end : new Date();
    // // this.dateError = val.end ? false : true;

    // let interestsArr : string[] = this.form.convertToArray(val, "interests")
    // let specialtiesArr : string[] = this.form.convertToArray(val, "specialties")

    // let newSpecialist: ISpecialist = {
    //   id: "",
    //   name: val.name,
    //   email: val.email,
    //   phone: val.phone,
    //   city: `${cityInfo.join(", ")}`,
    //   region: cityInfo[1],
    //   BM: val.bm,
    //   experience: 0,
    //   degree: val.degree,
    //   interests: interestsArr,
    //   available_from: this.form.formatDate(date),
    //   notice: val.end ? this.form.daysBetween(val.start, date) : 0,
    //   latitude: lat,
    //   longitude: lng,
    //   mobility: ["false"]
    // }
    // console.log(newSpecialist)
    // this.filter.addSpecialist(newSpecialist);
    // this.specialistForm.reset();
  }

  add(){    
    this.isClient? this.addClient() : this.addSpecialist();
    this.resultMessage = `${this.isClient? 'Client': 'Consultant'} successfully added`
  }

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
  getButton(condition: boolean){return this.helper.getButton(condition)}
  
}
