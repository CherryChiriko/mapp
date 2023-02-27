import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import * as XLSX from 'xlsx';
import { IClient, ISpecialist } from '../interfaces/interfaces';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(
    private _filt: FilterService,
    private _fileSaver: FileSaverService
  ) {}

  //-------------------------------------------------------------------------Metodi Specialisti
  public importSpecialists(event: any) {
    const file = event.target.files[0];
    const extension = file.name.split('.').pop(); //ottengo l'estensione del file
    if (extension !== 'xlsx' && extension !== 'xls') {
      alert('Errore: il file non è un file Excel valido');
      return;
    } else {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        let workBook = XLSX.read(fileReader.result, { type: 'binary' });
        let data = workBook.SheetNames;
        this._filt.initSpecialist(
          XLSX.utils.sheet_to_json(workBook.Sheets[data[0]])
        );
      };
    }
  }

  public exportSpecialists(specialistArray: ISpecialist[]) {
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

  formatExcelSpecialistArr(sData: any[]): ISpecialist[] {
    let specialists: ISpecialist[] = [];
    sData.map((s) => specialists.push(this.formatExcelSpecialist(s)));
    return specialists;
  }
  formatExcelSpecialist(s: any): ISpecialist {
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      city: s.city,
      mobility: s.mobility,
      BM: s.bm,
      experience: s.experience,
      background: s.background,
      interests: s.interests,
      available_from: s.available_from ? s.available_from : null,
    };
  }

  //--------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------Metodi Clienti
  public importClients(event: any) {
    const file = event.target.files[0];
    const extension = file.name.split('.').pop(); //ottengo l'estensione del file
    if (extension !== 'xlsx' && extension !== 'xls') {
      alert('Errore: il file non è un file Excel valido');
      return;
    } else {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        let workBook = XLSX.read(fileReader.result, { type: 'binary' });
        let data = workBook.SheetNames;
        this._filt.initClient(
          XLSX.utils.sheet_to_json(workBook.Sheets[data[0]])
        );
      };
    }
  }

  public exportClients(clientArray: IClient[]) {
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

  formatExcelClientArr(cData: IClient[]): IClient[] {
    let clients: IClient[] = [];
    cData.map((c) => clients.push(this.formatExcelClient(c)));
    return clients;
  }

  public formatExcelClient(c: any): IClient {
    return {
      name: c.name,
      logo: c?.logo,
      city: c.city,
      BM: c.bm,
      activities: c.activities,
      need: c.need,
    };
  }

  //-------------------------------------------------------------------------------lista preferiti
  exportFavorites(favoritesArray: ISpecialist[]) {
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
