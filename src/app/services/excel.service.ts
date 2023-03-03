import { provideImageKitLoader } from '@angular/common';
import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import * as XLSX from 'xlsx';
import { IClient, ISpecialist } from '../interfaces/interfaces';
import { FilterService } from './filter.service';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(
    private _filt: FilterService,
    private _fileSaver: FileSaverService,
    private _form : FormService
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
        let rawData =  XLSX.utils.sheet_to_json(workBook.Sheets[data[0]]);
        let format = rawData.map((val) => this.formatSp(val));
        this._filt.initSpecialist(format);
      };
    }
  }

  formatSp(s: any){
    let interestsStr = s.interests;
    let interestsArr = interestsStr.split(',');

    let mobilityStr = s.mobility;
    let mobilityArr = mobilityStr.split(',');
    return {
      name: s.name,
      id: s.id,
      email: s.email,
      phone: s.phone,
      website: s.website? s.website: undefined,
      city: s.city,
      bm: s.bm,
      experience: s.experience,
      background: s.background,
      mobility: mobilityArr,
      interests:  interestsArr,
      available_from: s.available_from ? s.available_from: undefined,
      notice: s.notice ? s.notice : undefined,
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
    let interestsArr = s.interests;
    let interestsStr = interestsArr.join(',');

    let mobilityArr = s.mobility;
    let mobilityStr = mobilityArr.join(',');

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      city: s.city,
      mobility: mobilityStr,
      bm: s.bm,
      experience: s.experience,
      background: s.background,
      interests: interestsStr,
      available_from: s.available_from ? s.available_from : null,
      notice : s.notice
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
        let rawData = XLSX.utils.sheet_to_json(workBook.Sheets[data[0]])
        let format = rawData.map((val) =>
          this.formatCl(val)
        );
        this._filt.initClient(format);
      };
    }
  }

  formatCl(client : any) {
    let activitiesStr = client.activities;
    let activitiesAr = activitiesStr.split(',');

    return {
      name: client.name,
      city: client.city,
      bm: client.bm,
      logo: client?.logo,
      activities: activitiesAr,
      need: client.need
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
    let activitiesArr = c.activities;
    let activitiesStr = activitiesArr.join(',');
    return {
      name : c.name,
      logo : c?.logo,
      city : c.city,
      bm : c.bm,
      activities : activitiesStr,
      need : c.need
    }
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
