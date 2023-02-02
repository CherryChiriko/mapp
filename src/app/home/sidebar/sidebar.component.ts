import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import intlTelInput from 'intl-tel-input';
// import datepicker from 'jquery-datepicker';
import moment from 'moment';
import { ISpecialist } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  @ViewChild('mapSearchField') searchField !: { nativeElement: HTMLInputElement; };

  reactiveForm !: FormGroup;
  isClientOpen: boolean = false;
  isSpecialistOpen: boolean = false;

  newSpecialist !: ISpecialist;

  // phoneInputField: Element = document.querySelector("#phone")!;
  // phoneInput = window?.intlTelInput(this.phoneInputField, {
  //   utilsScript:
  //     "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  // });

  constructor(private _excel : ExcelService){}

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      city: new FormControl(null),
      name: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
      degree: new FormControl(null),
      // email: new FormControl(null),
      // email: new FormControl(null),
    })
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
    const val = this.reactiveForm.value;
    console.log(val)
    this.newSpecialist = {
      Nome: val.name,
      Email: val.email,
      Telefono: val.phone,
      Domicilio: val.city,
      Disp_Trasferimento: val.canMove,
      Studi: val.degree,
      Competenza_Princ: val.specialties[0],
      Drivers: [],
      Disponibilita_dal: "",
      Preavviso: 0,
      Latitude: 0,
      Longitude: 0
    }
    console.log(this.newSpecialist)
    // this.addMarker({ "lat": 43.48, "lng": 1.68})
  }

  toggleSpecialist(){this.isSpecialistOpen = !this.isSpecialistOpen}
  toggleClient(){this.isClientOpen = !this.isClientOpen}
  // add(){
  //   const val = this.reactiveForm.value;
  //   this._excel.addCity({
  //     Nome : "sss",
  //     Email: "E",
  //     Telefono: "222",
  //     Domicilio: "aa",
  //     Disp_Trasferimento: true,
  //     Studi : "aa",
  //     Competenza_Princ : "ss",
  //     Drivers: [""],
  //     Disponibilita_dal : "20/10/22",
  //     Preavviso : 2,
  //     Latitude: 43.48,
  //     Longitude : 1.68
  // })

    // this.addMarker({ "lat": 43.48, "lng": 1.68})
    // val.name !== null  ? this.newSpecialist.name = val.name : null;
    // val.species !== null  ? this.newSpecialist.species = val.species : null;
    // val.country !== null  ? this.newSpecialist.country = val.country : null;
    // val.city !== null  ? this.newSpecialist.city = val.city : null;
    // val.email !== null && this.reactiveForm.valid ? this.newSpecialist.email = val.email : null;
  // }




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

  //   this.markers.push(marker);
  // }

  // add(){
  //   const val = this.reactiveForm.value;

  //   this.addMarker({ "lat": 43.48, "lng": 1.68})
  //   // val.name !== null  ? this.newSpecialist.name = val.name : null;
  //   // val.species !== null  ? this.newSpecialist.species = val.species : null;
  //   // val.country !== null  ? this.newSpecialist.country = val.country : null;
  //   // val.city !== null  ? this.newSpecialist.city = val.city : null;
  //   // val.email !== null && this.reactiveForm.valid ? this.newSpecialist.email = val.email : null;
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

