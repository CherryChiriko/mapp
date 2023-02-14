import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { Observable, ReplaySubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { IClient, ISpecialist } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private _fileSaver: FileSaverService) {}

  //---------------------------------------------------------------------------Specialisti
  private _specialistArray: ISpecialist[] = [];
  private specialistSubject$ = new ReplaySubject<ISpecialist[]>(1);

  private get specialistArray() {
    return this._specialistArray;
  }

  private set specialistArray(value: ISpecialist[]) {
    this._specialistArray = value;
    this.specialistSubject$.next(value);
  }
  //-----------------------------------------------------------------------------

  //---------------------------------------------------------------------------Clienti
  private _clientArray: IClient[] = [];
  private clientSubject$ = new ReplaySubject<IClient[]>(1);

  public get clientArray() {
    return this._clientArray;
  }

  public set clientArray(value: IClient[]) {
    this._clientArray = value;
    this.clientSubject$.next(value);
  }
  //----------------------------------------------------------------------------

  //-------------------------------------------------------------------------Metodi Specialisti
  public importSpecialists(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary' });
      let data = workBook.SheetNames;
      this.specialistArray = XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]);
    };
  }

  public exportSpecialists() {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(this.specialistArray);
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

  public getAllSpecialists(): Observable<ISpecialist[]> {
    return this.specialistSubject$;
  }

  /**
   * Ci facciamo ritornare il subject specialistSubscription per poterlo
   * usare nell'altro service
   * @returns
   */
  public getSpecialistsSubject() {
    return this.specialistSubject$;
  }
  //--------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------Metodi Clienti
  public importClients(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary' });
      let data = workBook.SheetNames;
      this.clientArray = XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]);
    };
  }

  public exportClients() {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    //custom code
    const worksheet = XLSX.utils.json_to_sheet(this.clientArray);
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

  public getAllClients(): Observable<IClient[]> {
    return this.clientSubject$;
  }

  public getClientSubject() {
    return this.clientSubject$;
  }


}
