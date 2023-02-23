import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import * as XLSX from 'xlsx';
import { IClient, ISpecialist } from '../interfaces/interfaces';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private _filt: FilterService,private _fileSaver: FileSaverService) {}

  //-------------------------------------------------------------------------Metodi Specialisti
  public importSpecialists(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary' });
      let data = workBook.SheetNames;
      this._filt.initSpecialist(XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]));
    };
  }

  public exportSpecialists(specialistArray : ISpecialist[]) {

    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(specialistArray);
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
    this._fileSaver.save(blobData, 'specialistFile');
  }

  //--------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------Metodi Clienti
  public importClients(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary'});
      let data = workBook.SheetNames;
      this._filt.initClient(XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]));

    };
  }

  public exportClients(clientArray : IClient[]) {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(clientArray);
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
    this._fileSaver.save(blobData, 'clientFile');
  }

  //-------------------------------------------------------------------------------lista preferiti
  exportFavorites(favoritesArray : ISpecialist[]) {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(favoritesArray);
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
    this._fileSaver.save(blobData, 'favoritesSpecialistFile');
  }





}
