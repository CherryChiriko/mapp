import { Component, Input } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-load-excel',
  templateUrl: './load-excel.component.html',
  styleUrls: ['./load-excel.component.css']
})
export class LoadExcelComponent {
  @Input() isClient!: boolean;

  constructor(private _excel: ExcelService) {}

  public loadSpecialists(event: any) {
    this._excel.importSpecialists(event);
  }

  public saveSpecialists() {
     }

  public loadClients(event: any) {
    this._excel.importClients(event);
  }

  public saveClients() {

  }
}
