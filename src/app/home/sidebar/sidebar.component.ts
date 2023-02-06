import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import intlTelInput from 'intl-tel-input';
// import datepicker from 'jquery-datepicker';
import moment from 'moment';
import { ISFilter, ISpecialist } from 'src/app/interfaces/interfaces';
import { MapService } from 'src/app/services/map.service';
import { Subscription } from 'rxjs';

import data from 'src/assets/specifics.json'
import { HttpClient } from '@angular/common/http';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  @ViewChild('mapSearchField') searchField !: { nativeElement: HTMLInputElement; };

  // specialists: ISpecialist[] =  [];
  // markersSubs ?: Subscription;
  specialArr: string[] = data.specialties;
  degArr: string[] = data.degrees;
  
  specialistForm !: FormGroup;
  clientForm!: FormGroup;
  filterForm !: FormGroup;

  isFilterOpen: boolean = false;
  isFilterSpecialistOpen: boolean = false;
  isFilterClientOpen: boolean = false;

  isNewOpen: boolean = false;
  isClientOpen: boolean = false;
  isSpecialistOpen: boolean = false;

  
  // phoneInputField: Element = document.querySelector("#phone")!;
  // phoneInput = window?.intlTelInput(this.phoneInputField, {
  //   utilsScript:
  //     "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  // });

  constructor(private _excel : ExcelService, private map: MapService, private form: FormService){}

  ngOnInit(): void {
    this.specialistForm = new FormGroup({
      city: new FormControl(null),
      name: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
      degree: new FormControl(null),
      specialties: new FormControl(null),
      interests: new FormGroup({}),
      canMove: new FormControl(null),
    });

    this.clientForm = new FormGroup({ 
      name: new FormControl(null),
    });

    this.filterForm = new FormGroup({ 
      name: new FormControl(null),
      degree: new FormGroup({}),
      specialties: new FormGroup({}),
      interests: new FormGroup({}),
      canMove: new FormControl(null),
    });

    this.form.addElementToFormGroup(this.specialistForm, 'interests', this.specialArr)
    this.form.addElementToFormGroup(this.filterForm, 'specialties', this.specialArr)
    this.form.addElementToFormGroup(this.filterForm, 'degree', this.degArr)
    this.form.addElementToFormGroup(this.filterForm, 'interests', this.specialArr)

    // this.http.get('../assets/specialties.json').subscribe( val=>
    //   this.specialArr = val);
    // this.markersSubs = this.map.getMarkers().subscribe(
    //   value => this.specialists = value);
    
  }
  ngAfterViewInit(): void{
    const searchBox = 
    new google.maps.places.SearchBox(
      this.searchField.nativeElement,
      );
    searchBox.addListener('places_changed', ()=>{
      const places = searchBox.getPlaces();
      console.log(places)
      if (places?.length === 0){return;}
    })
  }


  addClient(){

  }
  addSpecialist(){
    const val = this.specialistForm.value;
    let interestsArr : string[] = this.form.convertToArray(val, "interests")

    let newSpecialist: ISpecialist = {
      Nome: val.name,
      Email: val.email,
      Telefono: val.phone,
      Domicilio: val.city,
      Disp_Trasferimento: val.canMove,
      Studi: val.degree,
      Competenza_Princ: val.specialties,
      Drivers: interestsArr,
      Disponibilita_dal: "",
      Preavviso: 0,
      Latitude: 43.48,
      Longitude: 1.68
    }
    console.log(newSpecialist)
    this.map.addMarker(newSpecialist);
    // this._excel.addCity(newSpecialist);
  }
  filterSpecialist(){
    const val = this.filterForm.value;
    
    let degreeArr : string[] = this.form.convertToArray(val, "degree");
    let specialtiesArr : string[] = this.form.convertToArray(val, "specialties");
    let interestsArr : string[] = this.form.convertToArray(val, "interests");

    let specialistFilter: ISFilter = {
      Nome: val.name,
      Domicilio: val.city,
      Disp_Trasferimento: val.canMove,
      Studi: degreeArr,
      Competenza_Princ: specialtiesArr,
      Drivers: interestsArr,
      Disponibilita_dal: "",
      Preavviso: 0
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
  
  // logger(s:any){console.log(s)}
  // ngOnDestroy(){
  //   this.markersSubs?.unsubscribe();
  // }

  searchCity(){this.form.searchCity("Roma")}

  // addMarker(latLng: google.maps.LatLngLiteral, color: string = 'yellow') {
  //   // let img = picture === null ? `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png` :
  //   // `../assets/${picture}`;

  //   // let url = "..\\assets\\img\\ima_logo.png"
  //   let img = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
  //   console.log(color)
  //   let marker = new google.maps.Marker({
  //     position: latLng,
  //     icon: img
  //   });
  // }

  



//   initAutocomplete() {
//   const map = new google.maps.Map(
//     document.getElementById("map") as HTMLElement,
//     {
//       center: { lat: -33.8688, lng: 151.2195 },
//       zoom: 13,
//       mapTypeId: "roadmap",
//     }
//   );

//   // Create the search box and link it to the UI element.
//   const input = document.getElementById("pac-input") as HTMLInputElement;
//   const searchBox = new google.maps.places.SearchBox(input);

//   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//   // Bias the SearchBox results towards current map's viewport.
//   map.addListener("bounds_changed", () => {
//     searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
//   });

//   let markers: google.maps.Marker[] = [];

//   // Listen for the event fired when the user selects a prediction and retrieve
//   // more details for that place.
//   searchBox.addListener("places_changed", () => {
//     const places = searchBox.getPlaces();

//     if (places?.length == 0) {
//       return;
//     }

//     // Clear out the old markers.
//     markers.forEach((marker) => {
//       marker.setMap(null);
//     });
//     markers = [];

//     // For each place, get the icon, name and location.
//     const bounds = new google.maps.LatLngBounds();

//     places?.forEach((place) => {
//       if (!place.geometry || !place.geometry.location) {
//         console.log("Returned place contains no geometry");
//         return;
//       }

//       const icon = {
//         url: place.icon as string,
//         size: new google.maps.Size(71, 71),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(17, 34),
//         scaledSize: new google.maps.Size(25, 25),
//       };

//       // Create a marker for each place.
//       markers.push(
//         new google.maps.Marker({
//           map,
//           icon,
//           title: place.name,
//           position: place.geometry.location,
//         })
//       );

//       if (place.geometry.viewport) {
//         // Only geocodes have viewport.
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     map.fitBounds(bounds);
//   });
// }


}




var start: any = moment().subtract(29, "days");
var end: any = moment();

function cb(start: any, end: any) {
    $("#kt_daterangepicker_4").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));
}

// $("#kt_daterangepicker_4").daterangepicker({
//     startDate: start,
//     endDate: end,
//     ranges: {
//     "Today": [moment(), moment()],
//     "Yesterday": [moment().subtract(1, "days"), moment().subtract(1, "days")],
//     "Last 7 Days": [moment().subtract(6, "days"), moment()],
//     "Last 30 Days": [moment().subtract(29, "days"), moment()],
//     "This Month": [moment().startOf("month"), moment().endOf("month")],
//     "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
//     }
// }, cb);

cb(start, end);

