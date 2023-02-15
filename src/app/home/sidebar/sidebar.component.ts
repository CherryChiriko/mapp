import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { MapService } from 'src/app/services/map.service';

import { FormService } from 'src/app/services/form.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  
  isFilterOpen: boolean = false;
  isFilterSpecialistOpen: boolean = false;
  isFilterClientOpen: boolean = false;
  // isCustomDateSelected: boolean = true;

  isNewOpen: boolean = false;
  isClientOpen: boolean = false;
  isSpecialistOpen: boolean = false;

  formError: boolean = false;

  constructor(private helper: HelperService){}

  ngOnInit(): void {}

  toggleFilter(){           this.isFilterOpen = !this.isFilterOpen}
  toggleFilterSpecialist(){ this.isFilterSpecialistOpen = !this.isFilterSpecialistOpen}
  toggleFilterClient(){     this.isFilterClientOpen = !this.isFilterClientOpen}
  toggleNew(){              this.isNewOpen = !this.isNewOpen}
  toggleSpecialist(){       this.isSpecialistOpen = !this.isSpecialistOpen}
  toggleClient(){           this.isClientOpen = !this.isClientOpen}

  getColor(condition: boolean){return this.helper.getColorScheme(condition)}
}


