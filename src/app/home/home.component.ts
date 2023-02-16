import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ngOnInit() {}

  constructor(private _excel: ExcelService) {}
  public loadSpecialists(event: any) {
    this._excel.importSpecialists(event);
    console.log('File consulent open with success');
  }

  public saveSpecialists() {
    this._excel.exportSpecialists();
  }

  public loadClients(event: any) {
    this._excel.importClients(event);
    console.log('File client open with success');
  }

  public saveClients() {
    this._excel.exportClients();
  }
}
