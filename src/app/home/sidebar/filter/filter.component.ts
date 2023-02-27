import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICFilter, ICity, ISFilter } from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

import data from 'src/assets/specifics.json';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() isClient!: boolean;
  @Output() private onSFormGroupChange = new EventEmitter<any>();
  @Output() private onCFormGroupChange = new EventEmitter<any>();

  BMs: string[] = data.BMs;
  rolesArrTot: any = data.activities;
  // specialArr: string[] = data.specialties;
  // specialArr: string[] = [];
  // degArr: string[] = data.degrees;
  // macroregions = data.macroregions;

  // citiesArr: ICity[] = this.form.getAllCities();

  sFilterForm !: FormGroup;
  cFilterForm !: FormGroup;
  
  checkedRegions: string[] = [];

  constructor(private form: FormService, private filter: FilterService, private helper: HelperService){}

  ngOnInit(): void {
    
    // let regionArr: string[] = this.form.getArr(this.macroregions, 'regions');

    this.cFilterForm = new FormGroup({
      name: new FormControl(null),
      bm: new FormControl(null),
      needed_activities: new FormGroup({}),
      need: new FormControl(null)
    });

    this.sFilterForm = new FormGroup({
      id: new FormControl(null),
      bm: new FormControl(null),
      regions: new FormGroup({}),
      interests: new FormGroup({}),
      experience: new FormControl(null),
      date: new FormControl(null)
    });

    // this.form.addElementToFormGroup(this.sFilterForm, 'specialties', this.specialArr)
    // this.form.addElementToFormGroup(this.sFilterForm, 'degree', this.degArr)
    // this.form.addElementToFormGroup(this.sFilterForm, 'interests', this.specialArr)
    // this.form.addElementToFormGroup(this.sFilterForm, 'regions', regionArr)

    // this.form.addElementToFormGroup(this.cFilterForm, 'specialties', this.specialArr)
    // this.form.addElementToFormGroup(this.cFilterForm, 'degree', this.degArr)
    // this.form.addElementToFormGroup(this.cFilterForm, 'interests', this.specialArr)    
    // this.form.addElementToFormGroup(this.cFilterForm, 'regions', regionArr)
  
    this.sFilterForm.valueChanges
    .subscribe(() => this.onSFormGroupChange.emit(this.sFilterForm.value));
    this.cFilterForm.valueChanges
    .subscribe(() => this.onCFormGroupChange.emit(this.cFilterForm.value));

  }

  createFilter(isClient: boolean){
    const val = isClient? this.cFilterForm.value: this.sFilterForm.value;
    // const degreeArr : string[] = this.form.convertToArray(val, "degree");
    // const specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    // const interestsArr : string[] = this.form.convertToArray(val, "interests");
    // const regionsArr : string[] = this.form.convertToArray(val, "regions")
    // const date = val.end? [this.form.formatDate(val.start),this.form.formatDate(val.end)]: null;


    const date = this.helper.addDays(val.date);

    if (isClient){
      let clientFilter: ICFilter = {
        name: val.name,
        BM: val.bm,
        needed_activities: null,
        need: null
      }
      console.log(clientFilter)
      this.filter.setCFilter(clientFilter);
      this.cFilterForm.reset();
    }
    else {
      let specialistFilter: ISFilter = {
        id: val.id,
        BM: val.bm,
        regions: null,
        interests: null,
        experience: null,
        date: date
        // date: val.date? new Date() : null
      }
      console.log(specialistFilter)
      this.filter.setSFilter(specialistFilter);
      this.sFilterForm.reset();
    }
  }

  clearSFilter(){ 
    this.cFilterForm.reset(); this.filter.resetSFilter(); this.checkedRegions = [];};
  clearCFilter(){ 
    this.cFilterForm.reset(); this.filter.resetCFilter()};

  clearFilter(isClient: boolean){isClient? this.clearCFilter(): this.clearSFilter();}
  
  checkAll(macro: string){  
    const element: any = document.getElementsByName(macro); 
    for(var i=0; i<element.length; i++){  
        if(element[i].type=='checkbox')  {
          element[i].checked=true;
          this.checkedRegions.push(element[i].value)
        }
    }  
  } 

  getButton(condition: boolean, outline: boolean = false){ return this.helper.getButton(condition, outline)}
}


// const cityInfo: string[] = val.city.split(",");
//     let date: string | number = 
//     typeof(val.start)==='number'? val.start: this.form.formatDate(val.start);
//     const interestsArr: string[] = this.form.convertToArray(val, "interests");
//     const regionsArr : string[] = this.form.getRegions(val, this.checkedRegions);
//     this.checkedRegions = [];

//     let newSpecialist = {
//       name: val.name,
//       id: val.id,
//       city: cityInfo[0],
//       BM: val.bm,

//       email: val.email,
//       phone: val.phone,
//       website: val.website,

//       background: val.background,
//       experience: val.experience,
//       interests: interestsArr.join(', '),
//       mobility: regionsArr.join(', '),
//       start: date
//     }