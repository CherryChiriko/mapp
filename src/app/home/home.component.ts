import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ngOnInit() {}

  constructor(private helper: HelperService) {}

  getColor(condition: boolean){return this.helper.getColorScheme(condition)}
}
