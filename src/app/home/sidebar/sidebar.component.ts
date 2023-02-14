import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import { ICity, IClient, ISFilter, ISpecialist } from 'src/app/interfaces/interfaces';
import { MapService } from 'src/app/services/map.service';

import data from 'src/assets/specifics.json';
import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  // @ViewChild('mapSearchField', { static: true }) searchField: any;

  specialArr: string[] = data.specialties;
  degArr: string[] = data.degrees;
  citiesArr: ICity[] = this.form.getAllCities();
  
  specialistForm !: FormGroup;
  clientForm!: FormGroup;
  filterForm !: FormGroup;
  cityForm !: FormGroup;

  isFilterOpen: boolean = false;
  isFilterSpecialistOpen: boolean = false;
  isFilterClientOpen: boolean = false;
  isCustomDateSelected: boolean = true;

  isNewOpen: boolean = false;
  isClientOpen: boolean = false;
  isSpecialistOpen: boolean = false;

  formError: boolean = false;

  constructor(private _excel : ExcelService, private map: MapService, private form: FormService, private helper: HelperService){}

  ngOnInit(): void {
    this.specialistForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null, [Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      phone: new FormControl(null),
      degree: new FormControl(null),
      // specialties: new FormControl(null),
      interests: new FormGroup({}),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      canMove: new FormControl(null),
    });

    this.clientForm = new FormGroup({ 
      name: new FormControl(null),
      website: new FormControl(""),
      picture: new FormControl(null),
      lookFor: new FormGroup({}),
      // level: new FormGroup(null),
      online: new FormControl(null),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.filterForm = new FormGroup({ 
      name: new FormControl(null),
      degree: new FormGroup({}),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      canMove: new FormControl(null),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      notice: new FormControl(null)
    });

    // this.filterForm = new FormGroup({ 
    //   name: new FormControl(null),
    //   degree: new FormGroup({}),
    //   specialties: new FormGroup({}),
    //   interests: new FormGroup({}),
    //   canMove: new FormControl(null),
    // });

    this.cityForm = new FormGroup({
      city: new FormControl(null, [Validators.required])
    })

    this.form.addElementToFormGroup(this.specialistForm, 'interests', this.specialArr)
    this.form.addElementToFormGroup(this.filterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.filterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.filterForm, 'interests', this.specialArr)
    this.form.addElementToFormGroup(this.clientForm, 'lookFor', this.specialArr)
  }
  ngAfterViewInit(): void{
    // const searchBox = 
    // new google.maps.places.SearchBox(
    //   this.searchField.nativeElement,
    //   );
    // searchBox.addListener('places_changed', ()=>{
    //   const places = searchBox.getPlaces();
    //   console.log(places)
    //   if (places?.length === 0){return;}
    // })
  }


  filterSpecialist(){
    const val = this.filterForm.value;
    
    let degreeArr : string[] = this.form.convertToArray(val, "degree");
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    let interestsArr : string[] = this.form.convertToArray(val, "interests");
    
    let specialistFilter: ISFilter = {
      name: val.name,
      city: val.city,
      canMove: val.canMove,
      degree: degreeArr,
      skills: specialtiesArr,
      interests: interestsArr,
      available_from: [this.form.formatDate(val.start),this.form.formatDate(val.end)],
      notice: val.notice
    }
    console.log(specialistFilter)
    // call service
  }
  
  toggleFilter(){           this.isFilterOpen = !this.isFilterOpen}
  toggleFilterSpecialist(){ this.isFilterSpecialistOpen = !this.isFilterSpecialistOpen}
  toggleFilterClient(){     this.isFilterClientOpen = !this.isFilterClientOpen}
  toggleNew(){              this.isNewOpen = !this.isNewOpen}
  toggleSpecialist(){       this.isSpecialistOpen = !this.isSpecialistOpen}
  toggleClient(){           this.isClientOpen = !this.isClientOpen}

  formatLabel(value: number): string {
    switch(value){
      case 0: return "No experience";
      case 1: return "Some experience";
      case 2: return "Technical high school";
      case 3: return "Bachelor degree";
      case 4: return "Master degree";
      case 5: return "Ph.D.";
      case 6: return "Senior developer";
    }
    return "";
  }
  getColor(condition: boolean){return this.helper.getColorScheme(condition)}
  // isClient(element: IClient | ISpecialist){    return element.hasOwnProperty('website') ?  true : false  }
}


