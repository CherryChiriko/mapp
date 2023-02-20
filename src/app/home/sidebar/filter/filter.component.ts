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
  macroregions = data["macro-regions"];

  citiesArr: ICity[] = this.form.getAllCities();

  sFilterForm !: FormGroup;
  cFilterForm !: FormGroup;

  constructor(private form: FormService, private filter: FilterService){}

  ngOnInit(): void {
    
    let regionArr: string[] = this.form.getRegions(this.macroregions);

    this.sFilterForm = new FormGroup({
      name: new FormControl(null),
      regions: new FormGroup({}),
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
      regions: new FormGroup({}),
      degree: new FormGroup({}),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      online: new FormControl(null),
    });

    this.form.addElementToFormGroup(this.sFilterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'interests', this.specialArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'regions', regionArr)

    this.form.addElementToFormGroup(this.cFilterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.cFilterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.cFilterForm, 'interests', this.specialArr)    
    this.form.addElementToFormGroup(this.cFilterForm, 'regions', regionArr)
  }

  createFilter(isClient: boolean){
    const val = isClient? this.cFilterForm.value: this.sFilterForm.value;
    const degreeArr : string[] = this.form.convertToArray(val, "degree");
    const specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    const interestsArr : string[] = this.form.convertToArray(val, "interests");
    const regionsArr : string[] = this.form.convertToArray(val, "regions")
    const date = val.end? [this.form.formatDate(val.start),this.form.formatDate(val.end)]: null;

    if (isClient){
      let clientFilter: ICFilter = {
        name: val.name,
        region: regionsArr,
        experience: degreeArr,
        lookFor: specialtiesArr,
        // interests: interestsArr,
        available_from: date,
        notice: val.notice
      }
      console.log(clientFilter)
      this.filter.setCFilter(clientFilter);
      this.cFilterForm.reset();
    }
    else {
      let specialistFilter: ISFilter = {
        name: val.name,
        region: regionsArr,
        // regions: val.regions,
        mobility: null,
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
  }

  clearSFilter(){ 
    this.cFilterForm.reset(); this.filter.resetSFilter()};
  clearCFilter(){ 
    this.cFilterForm.reset(); this.filter.resetCFilter()};

  clearFilter(isClient: boolean){isClient? this.clearCFilter(): this.clearSFilter();}
  
  checkAll(macro: string){
    $(".nort").prop('checked', $(this).prop('checked'))
    // $(`.${macro}`).prop('checked', $(this).prop('checked'));
  }

  selects(){  
    console.log("HERE");
    const ele: any = document.getElementsByName('nort');  
    console.log(ele);
    for(var i=0; i<ele.length; i++){  
        if(ele[i].type=='checkbox')  {
          ele[i].checked=true;  console.log("really")
        }
            
    }  
  }  
}
