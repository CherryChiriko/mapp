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
  @Output() private onFormGroupChange = new EventEmitter<any>();
  @Output() private onCFormGroupChange = new EventEmitter<any>();
  @Output() private onSFormGroupChange = new EventEmitter<any>();

  BMs: string[] = data.BMs;
  rolesArrTot: any = data.activities;

  macroregions = data.macroregions
  rolesArr: string[] = this.form.getArr(this.rolesArrTot, 'roles');
  regionArr: string[] = this.form.getArr(this.macroregions, 'regions');

  sFilterForm !: FormGroup;
  cFilterForm !: FormGroup;

  checkedRegions: string[] = [];
  isAllChecked = {"North": false, "Centre": false, "South": false}

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
      mobility: new FormGroup({}),
      regions: new FormGroup({}),
      interests: new FormGroup({}),
      experience: new FormControl(null),
      date: new FormControl(null)
    });

    this.form.addElementToFormGroup(this.cFilterForm, 'activities', this.rolesArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'interests', this.rolesArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'mobility', this.regionArr)
    this.form.addElementToFormGroup(this.sFilterForm, 'regions', this.regionArr)

    const filterForm = this.isClient ? this.cFilterForm : this.sFilterForm;
    const formChange = this.isClient ? this.onCFormGroupChange : this.onSFormGroupChange
    filterForm.valueChanges
    .subscribe(() => formChange.emit([filterForm.value, this.checkedRegions]));

  }

  clearSFilter(){
    this.cFilterForm.reset(); this.filter.resetSFilter(); this.checkedRegions = [];};
  clearCFilter(){
    this.cFilterForm.reset(); this.filter.resetCFilter()};

  clearFilter(isClient: boolean){isClient? this.clearCFilter(): this.clearSFilter();}

  checkAll(macro: "North" | "Centre" | "South"){
    const element: any   = document.getElementsByName(macro);
    const body   : any[] = [element, this.checkedRegions, this.isAllChecked[macro]];
    this.isAllChecked[macro] = this.helper.selectAll(body);
    this.sFilterForm.value.regions = this.checkedRegions
  }
  restrictRegions(macro: string): "North" | "Centre" | "South" {
    return this.helper.restrictRegions(macro)
  }

  getButton(condition: boolean, outline: boolean = false){ return this.helper.getButton(condition, outline)}

}
