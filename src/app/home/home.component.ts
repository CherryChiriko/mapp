import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { Subscription } from 'rxjs';
import { ISpecialist } from 'src/app/interfaces/interfaces';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{


  //specialists: ISpecialist[] =  [];
  //markersSubs ?: Subscription;

  ngOnInit(){
     //this.markersSubs = this._excel.getAll().subscribe(
       //value => this.specialists = value);
  }

  /*
   constructor(private _excel : ExcelService){}
   loadFile(event : any) {
     this._excel.loadExcelFile(event);
     console.log('File open with success');
   }*/

   /*
   addSpecialist(value : ISpecialist) {
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
}*/

 }