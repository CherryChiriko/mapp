import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { Observable, ReplaySubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private _fileSaver : FileSaverService) { }

  public _excelData : ISpecialist[] = [];
  private excelData$ = new ReplaySubject<ISpecialist[]>(1);

  private get excelData() {
    return this._excelData;
  }

  private set excelData(value : ISpecialist[]) {
    this._excelData = value;
    this.excelData$.next(value);
    }

  public loadExcelFile(event : any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      //console.log(e);
      let workBook = XLSX.read(fileReader.result, {type: 'binary'});
      let data = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]);
    }
  }

  public getAll() : Observable<ISpecialist[]> {
    return this.excelData$;
  }

  public addCity(value : ISpecialist) {
    this._excelData.push(value);
    this.excelData = this.excelData;
    console.log(this.excelData);
  }

  public exportExcel() {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(this.excelData);
    const workbook = {
      Sheets: {
        testingSheet: worksheet,
      },
      SheetNames: ['testingSheet'],
    };
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this._fileSaver.save(blobData, 'demoFile');
  }
}
