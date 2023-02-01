export interface IClient {
  Nome: string;
  Email : string;
  Telefono : string;
  Domicilio : string;
  Disp_Trasferimento : boolean;
  Studi : string;
  Competenza_Princ : string;
  Drivers : string[];
  Disponibilita_dal : Date;
  Preavviso : number;
  Latitude : number;
  Longitude : number;
}
