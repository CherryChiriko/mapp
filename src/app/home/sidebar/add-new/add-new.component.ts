import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ICity,
  IClient,
  IRawClient,
  ISpecialist,
} from 'src/app/interfaces/interfaces';
import { FilterService } from 'src/app/services/filter.service';
import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

import data from 'src/assets/specifics.json';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css'],
})
export class AddNewComponent {
  @Input() isClient!: boolean;
  @Output('add') result = new EventEmitter<{
    resultMessage: string;
    success: boolean;
  }>();

  citiesArr: ICity[] = this.form.getAllCities();
  BMs: string[] = data.BMs;
  rolesArrTot: any = data.activities;
  rolesArr: string[] = this.form.getArr(this.rolesArrTot, 'roles');
  degArr: string[] = data.degrees;
  macroregions = data.macroregions;
  regionArr: string[] = this.form.getArr(this.macroregions, 'regions');

  specialistForm!: FormGroup;
  clientForm!: FormGroup;

  checkedRegions: string[] = [];

  showNotice: boolean = true;
  isAllChecked = { North: false, Centre: false, South: false };

  constructor(
    private filter: FilterService,
    private form: FormService,
    private helper: HelperService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

      website: new FormControl(null, [
        Validators.pattern(
          'https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}'
        ),
      ]),
      email: new FormControl(null, [
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
      ]),
      phone: new FormControl(null),

      background: new FormControl(null),
      experience: new FormControl(null),
      interests: new FormGroup({}),
      main: new FormControl(null),
      mobility: new FormGroup({}),
      //start: new FormControl<Date | null | number>(null),
      notice: new FormControl<number | null>(null),
      available_from: new FormControl<Date | null>(null),
    });

    this.form.addElementToFormGroup(
      this.clientForm,
      'activities',
      this.rolesArr
    );
    this.form.addElementToFormGroup(
      this.specialistForm,
      'interests',
      this.rolesArr
    );
    this.form.addElementToFormGroup(
      this.specialistForm,
      'mobility',
      this.regionArr
    );
  }

  convertToArray(val: any, name: string) {
    return this.form.convertToArray(val, name);
  }

  checkAllItaly() {
    this.checkAll('North');
    this.checkAll('Centre');
    this.checkAll('South');
  }
  checkAll(macro: 'North' | 'Centre' | 'South') {
    const element: any = document.getElementsByName(macro);
    const body: any[] = [
      element,
      this.checkedRegions,
      this.isAllChecked[macro],
    ];
    this.isAllChecked[macro] = this.helper.selectAll(body);
  }
  restrictRegions(macro: string): 'North' | 'Centre' | 'South' {
    return this.helper.restrictRegions(macro);
  }

  addClient() {
    const val = this.clientForm.value;

    const cityInfo: string[] = val.city.split(',');
    const activitiesArr: string[] = this.convertToArray(val, 'activities');

    console.log(val);
    let newClient: IClient = {
      name: val.name,
      logo: val.picture,
      city: cityInfo[0],
      bm: val.bm,

      activities: activitiesArr,
      need: val.need,
    };
    console.log(newClient);
    this.filter.addClient(this.form.formatClient(newClient));
    this.clientForm.reset();
  }
  addSpecialist() {
    const val = this.specialistForm.value;

    const cityInfo: string[] = val.city.split(',');
    let date: string | number =
      typeof(val.start) === 'number' ? val.start : this.helper.formatDate(val.start);

    let interestsArr: string[] = this.convertToArray(val, 'interests');
    interestsArr = this.helper.moveElementToStart(val.main, interestsArr);

    const regionsArr: string[] = this.form.getRegions(val, this.checkedRegions);
    this.checkedRegions = [];

    let newSpecialist = {
      name: val.name,
      id: val.id,
      city: cityInfo[0],
      bm: val.bm,

      email: val.email,
      phone: val.phone,
      website: val.website,

      background: val.background,
      experience: val.experience,
      interests: interestsArr,
      mobility: regionsArr,
      //start: date
      available_from: val.available_from ? val.available_from : null,
      notice : val.notice
    };
    console.log(newSpecialist);
    this.filter.addSpecialist(this.form.formatSpecialist(newSpecialist));
    this.specialistForm.reset();
  }

  getButton(condition: boolean) {
    return this.helper.getButton(condition);
  }

  add() {
    (this.isClient && !this.clientForm.value.city) ||
    (!this.isClient && !this.specialistForm.value.city)
      ? alert(`City is missing`)
      : null;
    this.isClient ? this.addClient() : this.addSpecialist();
    this.result.emit({
      resultMessage: `${
        this.isClient ? 'Client' : 'Consultant'
      } successfully added`,
      success: true,
    });
    let res = {
      resultMessage: `${
        this.isClient ? 'Client' : 'Consultant'
      } successfully added`,
      success: true,
    };
    this.snackBar.open(res.resultMessage, '', { duration: 2000 });
    res.success = false;
  }

  toggleNotice() {
    this.showNotice = !this.showNotice;
  }
}
