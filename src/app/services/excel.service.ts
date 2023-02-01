import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { IClient } from '../interfaces/iclient';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public excelData ?: IClient[];

  public loadExcelFile(event : any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      console.log(e);
      let workBook = XLSX.read(fileReader.result, {type: 'binary'});
      let data = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]);
    }
  }

  public getAll() {
    return this.excelData;
  }
}
