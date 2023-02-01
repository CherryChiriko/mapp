import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  reactiveForm !: FormGroup;

  constructor(private _excel : ExcelService){}

  add(){
    const val = this.reactiveForm.value;
    this._excel.addCity({
      Nome : "sss",
      Email: "E",
      Telefono: "222",
      Domicilio: "aa",
      Disp_Trasferimento: true,
      Studi : "aa",
      Competenza_Princ : "ss",
      Drivers: [""],
      Disponibilita_dal : "20/10/22",
      Preavviso : 2,
      Latitude: 43.48,
      Longitude : 1.68
  })

    // this.addMarker({ "lat": 43.48, "lng": 1.68})
    // val.name !== null  ? this.profile.name = val.name : null;
    // val.species !== null  ? this.profile.species = val.species : null;
    // val.country !== null  ? this.profile.country = val.country : null;
    // val.city !== null  ? this.profile.city = val.city : null;
    // val.email !== null && this.reactiveForm.valid ? this.profile.email = val.email : null;
  }

  ngOnInit(){
    this.reactiveForm = new FormGroup({
      city: new FormControl(null),
      picture: new FormControl(null)
    })
  }


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
  //   // val.name !== null  ? this.profile.name = val.name : null;
  //   // val.species !== null  ? this.profile.species = val.species : null;
  //   // val.country !== null  ? this.profile.country = val.country : null;
  //   // val.city !== null  ? this.profile.city = val.city : null;
  //   // val.email !== null && this.reactiveForm.valid ? this.profile.email = val.email : null;
  // }
}
