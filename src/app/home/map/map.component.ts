import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  specialists: ISpecialist[] =  [];
  markersSubs ?: Subscription;

  INITIAL_COORDS = [41.9028, 12.4964]; // Roma
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 5;

  color: string = "orange";

  constructor(private map: MapService, private _excel : ExcelService){}

  ngOnInit(){
    this.markersSubs = this._excel.getAll().subscribe(
      value => this.specialists = value);
  }

  public loadFile(event : any) {
    this._excel.loadExcelFile(event);
    console.log('File open with success');
  }

  public addSpecialist(value : ISpecialist) {
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
      Latitude: 2222,
      Longitude : 333
  })
}

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  ngOnDestroy(){
    this.markersSubs?.unsubscribe();
  }
}
