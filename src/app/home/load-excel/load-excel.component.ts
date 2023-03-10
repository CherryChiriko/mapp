import { Component, Input } from '@angular/core';
import { IClient, ISpecialist } from 'src/app/interfaces/interfaces';
import { ExcelService } from 'src/app/services/excel.service';
import { FilterService } from 'src/app/services/filter.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-load-excel',
  templateUrl: './load-excel.component.html',
  styleUrls: ['./load-excel.component.css'],
})
export class LoadExcelComponent {
  @Input() isClient!: boolean;
  isCLoaded: boolean = false;
  isSLoaded: boolean = false;

  public specialistArray : ISpecialist[] = [];
  public clientArray : IClient[] = [];

  public clientArrayFormatted : IClient[] = [];
  public specialistArrayFormatted : ISpecialist[] = [];

  constructor(private _excel: ExcelService, private helper: HelperService, private _filt : FilterService) {
  }

  load(event: any){
    this.isClient? this._excel.importClients(event) : this._excel.importSpecialists(event);
    this.isClient? this.isCLoaded = true : this.isSLoaded = true;
  }
  save(){
    this.specialistArray = this._filt.getSpecialists();
    this.specialistArrayFormatted = this._excel.formatExcelSpecialistArr(this.specialistArray);

    this.clientArray = this._filt.getClients();
    this.clientArrayFormatted = this._excel.formatExcelClientArr(this.clientArray);
    console.log(this.clientArrayFormatted);


    this.isClient? this._excel.exportClients(this.clientArrayFormatted) : this._excel.exportSpecialists(this.specialistArrayFormatted);
  }
  loadNew(){ this.isClient? this.isCLoaded = false : this.isSLoaded = false}
  getButton(){ return this.helper.getButton(this.isClient)}

}
