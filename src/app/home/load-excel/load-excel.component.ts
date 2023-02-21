import { Component, Input } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-load-excel',
  templateUrl: './load-excel.component.html',
  styleUrls: ['./load-excel.component.css']
})
export class LoadExcelComponent {
  @Input() isClient!: boolean;
  isCLoaded: boolean = false;
  isSLoaded: boolean = false;

  constructor(private _excel: ExcelService, private helper: HelperService) {}

  load(event: any){ 
    this.isClient? this._excel.importClients(event) : this._excel.importSpecialists(event);
    this.isClient? this.isCLoaded = true : this.isSLoaded = true;
  }
  save(){
    this.isClient? this._excel.exportClients() : this._excel.exportSpecialists();
  }
  loadNew(){ this.isClient? this.isCLoaded = false : this.isSLoaded = false}  
  getButton(){ return this.helper.getButton(this.isClient)}
}
