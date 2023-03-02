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

  macroregions = data.macroregions
  rolesArr: string[] = this.form.getArr(this.rolesArrTot, 'roles');
  regionArr: string[] = this.form.getArr(this.macroregions, 'regions');

  sFilterForm !: FormGroup;
  cFilterForm !: FormGroup;

  checkedRegions: string[] = [];

  constructor(private form: FormService, private filter: FilterService, private helper: HelperService){}

  ngOnInit(): void {

    this.cFilterForm = new FormGroup({
      name: new FormControl(null),
      bm: new FormControl(null),
      activities: new FormGroup({}),
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

    this.form.addElementToFormGroup(this.cFilterForm, 'activities', this.rolesArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'interests', this.rolesArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'regions', this.regionArr)

    this.sFilterForm.valueChanges
    .subscribe(() => this.onSFormGroupChange.emit(this.sFilterForm.value));
    this.cFilterForm.valueChanges
    .subscribe(() => this.onCFormGroupChange.emit(this.cFilterForm.value));

  }

  createFilter(isClient: boolean){
    console.log("I am filter component")
    const val = isClient? this.cFilterForm.value: this.sFilterForm.value;
    const interestsArr : string[] = this.form.convertToArray(val, "interests");
    const regionsArr : string[] = this.form.getRegions(val, this.checkedRegions);
    this.checkedRegions = [];

    const date = this.helper.addDays(val.date);

    if (isClient){
      let clientFilter: ICFilter = {
        name: val.name,
        bm: val.bm,
        activities: interestsArr,
        need: val.need
      }
      console.log(clientFilter)
      this.filter.setCFilter(clientFilter);
      this.cFilterForm.reset();
    }
    else {
      let specialistFilter: ISFilter = {
        id: val.id,
        bm: val.bm,
        regions: regionsArr,
        interests: interestsArr,
        experience: null,
        date: date
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
