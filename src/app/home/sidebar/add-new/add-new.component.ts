import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output('add') result = new EventEmitter<{ resultMessage: string, success: boolean }>();


  citiesArr: ICity[] = this.form.getAllCities();
  BMs: string[] = data.BMs;
  rolesArrTot: any = data.activities;
  rolesArr: string[] = this.form.getArr(this.rolesArrTot, 'roles');
  degArr: string[] = data.degrees;  
  macroregions = data.macroregions;
  
  specialistForm !: FormGroup;
  clientForm!: FormGroup;

  constructor(private filter : FilterService, private form: FormService, private helper: HelperService){}

  ngOnInit(): void {

    const regionArr: string[] = this.form.getArr(this.macroregions, 'regions');
    const rolesArr: string[] = this.form.getArr(this.rolesArrTot, 'roles');

    this.clientForm = new FormGroup({ 
      city: new FormControl(null, [Validators.required]),
      name: new FormControl(null),
      bm: new FormControl(null),
      picture: new FormControl(null),
      activities: new FormGroup({}),
      need: new FormControl(null),
    });

    this.specialistForm = new FormGroup({
      city: new FormControl(null, [Validators.required]),
      name: new FormControl(null),
      id: new FormControl(null),
      bm: new FormControl(null),

      website: new FormControl(null, [Validators.pattern("https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}")]),
      email: new FormControl(null, [Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      phone: new FormControl(null),
      
      background: new FormControl(null),
      experience: new FormControl(null),
      interests: new FormGroup({}),
      mobility: new FormGroup({}),
      start: new FormControl<Date | null | number>(null)
    });

    this.form.addElementToFormGroup(this.clientForm, 'bm', this.BMs)
    this.form.addElementToFormGroup(this.clientForm, 'activities', rolesArr)

    this.form.addElementToFormGroup(this.specialistForm, 'bm', this.BMs)  
    this.form.addElementToFormGroup(this.specialistForm, 'interests', rolesArr)    
    this.form.addElementToFormGroup(this.specialistForm, 'mobility', regionArr)
  }

  addClient(){
    const val = this.clientForm.value;
    
    const cityInfo: string[] = val.city.split(",");
    const activitiesArr: string[] = this.form.convertToArray(val, "activities");  

    console.log(val)
    let newClient = {
      name: val.name,
      logo: val.picture,
      city: cityInfo[0],
      BM: val.bm,

      activities: activitiesArr,
      need: val.need
    }
    console.log(newClient)
    this.filter.addClient(this.form.formatClient(newClient));
    this.clientForm.reset();
  }
  addSpecialist(){
    const val = this.specialistForm.value;

    const cityInfo: string[] = val.city.split(",");
    const interestsArr: string[] = this.form.convertToArray(val, "interests");   
    const regionsArr : string[] = this.form.convertToArray(val, "mobility");

    console.log(val)

    let newSpecialist = {
      name: val.name,
      id: val.id,
      city: cityInfo[0],
      BM: val.bm,

      email: val.email,
      phone: val.phone,
      website: val.website,

      background: val.background,
      experience: val.experience,
      interests: interestsArr,
      mobility: regionsArr,
      start: val.start
    }
    console.log(newSpecialist)
    this.filter.addSpecialist(this.form.formatSpecialist(newSpecialist));
    this.specialistForm.reset();
  }

  add(){    
    this.isClient? this.addClient() : this.addSpecialist();
    this.result.emit(
      { resultMessage: `${this.isClient? 'Client': 'Consultant'} successfully added`, success: true})
  }

  getButton(condition: boolean){return this.helper.getButton(condition)}
  
}

