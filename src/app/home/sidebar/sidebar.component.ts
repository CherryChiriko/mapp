import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import { ICity, IClient, ISFilter, ISpecialist } from 'src/app/interfaces/interfaces';
import { MapService } from 'src/app/services/map.service';

import data from 'src/assets/specifics.json';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('mapSearchField', { static: true }) searchField: any;

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

  constructor(private _excel : ExcelService, private map: MapService, private form: FormService){}

  ngOnInit(): void {
    this.specialistForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null, [Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      phone: new FormControl(null),
      degree: new FormControl(null),
      specialties: new FormControl(null),
      interests: new FormGroup({}),
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      canMove: new FormControl(null),
    });

    this.clientForm = new FormGroup({ 
      name: new FormControl(null),
      website: new FormControl(null),
      picture: new FormControl(null),
      lookFor: new FormGroup({}),
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

  addClient(){
    const val = this.clientForm.value;
    
    const cityInfo: string[] = this.cityForm.value.city.split(",");
    const [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);

    let lookForArr : string[] = this.form.convertToArray(val, "lookFor")

    let newClient: IClient = {
      name: val.name,
      website: val.website,
      city: `${cityInfo.join(", ")}`,
      remoteOption: val.online,
      lookFor: lookForArr,
      available_from: this.form.formatDate(val.end),
      notice: this.form.daysBetween(val.start, val.end),
      latitude: lat,
      longitude: lng
    }
    console.log(newClient)
    this.map.addCMarker(newClient);
  }
  addSpecialist(){
    const val = this.specialistForm.value;
    
    const cityInfo: string[] = this.cityForm.value.city.split(",");
    const [lat, lng] = this.form.getCityCoordinates(cityInfo[0]);

    let interestsArr : string[] = this.form.convertToArray(val, "interests")

    let newSpecialist: ISpecialist = {
      name: val.name,
      email: val.email,
      phone: val.phone,
      city: `${cityInfo.join(", ")}`,
      canMove: val.canMove,
      degree: val.degree,
      skill: val.specialties,
      interests: interestsArr,
      available_from: this.form.formatDate(val.end),
      notice: this.form.daysBetween(val.start, val.end),
      latitude: lat,
      longitude: lng
    }
    console.log(newSpecialist)
    this.map.addSMarker(newSpecialist);
    // this._excel.addCity(newSpecialist);
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
      skill: specialtiesArr,
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
}


