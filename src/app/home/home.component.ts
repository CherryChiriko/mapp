import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  ngOnInit(){
  }

  constructor(private _excel : ExcelService){}
   loadFile(event : any) {
    //  this._excel.loadExcelFile(event);
    //  console.log('File open with success');
  }

}
