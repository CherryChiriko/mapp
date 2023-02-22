import { Component, Input } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-load-excel',
  templateUrl: './load-excel.component.html',
  styleUrls: ['./load-excel.component.css'],
})
export class LoadExcelComponent {
  @Input() isClient!: boolean;

  constructor(private _excel: ExcelService, private helper: HelperService) {}

  public saveSpecialists() {}

  public loadClients(event: any) {
    this._excel.importClients(event);
  }

  public saveClients() {}
  loadNew() {
    //this.isClient ? (this.isCLoaded = false) : (this.isSLoaded = false);
  }
  getButton() {
    return this.helper.getButton(this.isClient);
  }
}
