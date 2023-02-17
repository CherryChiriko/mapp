import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ICFilter, ICity, ISFilter } from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
import { FormService } from 'src/app/services/form.service';

import data from 'src/assets/specifics.json';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() isClient!: boolean;
  
  specialArr: string[] = data.specialties;
  degArr: string[] = data.degrees;
  citiesArr: ICity[] = this.form.getAllCities();
  
  sFilterForm !: FormGroup;
  cFilterForm !: FormGroup;

  constructor(private form: FormService, private filter: FilterService){}

  ngOnInit(): void {

    this.sFilterForm = new FormGroup({ 
      name: new FormControl(null),
      city: new FormControl(null),
      degree: new FormGroup({}),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      canMove: new FormControl(null),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      notice: new FormControl(null)
    });

    this.cFilterForm = new FormGroup({ 
      name: new FormControl(null),
      city: new FormControl(null),
      degree: new FormGroup({}),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      online: new FormControl(null),
    });

    this.form.addElementToFormGroup(this.sFilterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'interests', this.specialArr)

    this.form.addElementToFormGroup(this.cFilterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.cFilterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.cFilterForm, 'interests', this.specialArr)
  }

  filterSpecialist(){
    const val = this.sFilterForm.value;

    let degreeArr : string[] = this.form.convertToArray(val, "degree");
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    let interestsArr : string[] = this.form.convertToArray(val, "interests");

    let cityName = val.city? val.city.split(",")[0]: null;
    let date = val.end? [this.form.formatDate(val.start),this.form.formatDate(val.end)]: null;

    let specialistFilter: ISFilter = {
      name: val.name,
      city: cityName,
      canMove: val.canMove,
      degree: degreeArr,
      skills: specialtiesArr,
      interests: interestsArr,
      available_from: date,
      notice: val.notice
    }
    // console.log(specialistFilter)
    this.filter.setSFilter(specialistFilter);
    this.sFilterForm.reset();
  }

  filterClient(){
    const val = this.cFilterForm.value;    

    let degreeArr : string[] = this.form.convertToArray(val, "degree");
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    // let interestsArr : string[] = this.form.convertToArray(val, "interests");

    let cityName = val.city? val.city.split(",")[0]: null;
    let date = val.end? [this.form.formatDate(val.start),this.form.formatDate(val.end)]: null;
    
    let clientFilter: ICFilter = {
      name: val.name,
      online: val.online,
      city: cityName,
      experience: degreeArr,
      lookFor: specialtiesArr,
      // interests: interestsArr,
      available_from: date,
      notice: val.notice
    }
    // console.log(clientFilter)
    this.filter.setCFilter(clientFilter);
    this.cFilterForm.reset();
  }

  clearSFilter(){ 
    this.cFilterForm.reset(); this.filter.resetSFilter()};
  clearCFilter(){ 
    this.cFilterForm.reset(); this.filter.resetCFilter()};
  
}
