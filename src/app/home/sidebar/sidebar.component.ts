import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { FilterService } from 'src/app/services/filter.service';
import { ICFilter, ISFilter } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  isFilterOpen: boolean = false;
  isFilterSpecialistOpen: boolean = false;
  isFilterClientOpen: boolean = false;

  isNewOpen: boolean = false;
  isClientOpen: boolean = false;
  isSpecialistOpen: boolean = false;

  isFilterOn: boolean = true;
  CFilt!: ICFilter;  SFilt!: ISFilter;

  message = { resultMessage: '', success: false};

  constructor(private helper: HelperService, private filter: FilterService){}

  ngOnInit(): void {}

  toggleFilter(){           this.isFilterOpen = !this.isFilterOpen;  }
  toggleFilterSpecialist(){
    this.isFilterSpecialistOpen = !this.isFilterSpecialistOpen;
    if (this.isFilterSpecialistOpen) {this.isNewOpen = false}
  }
  toggleFilterClient(){
    this.isFilterClientOpen = !this.isFilterClientOpen;
    if (this.isFilterClientOpen) {this.isNewOpen = false}
  }
  toggleNew(){              this.isNewOpen = !this.isNewOpen}
  toggleSpecialist(){       this.isSpecialistOpen = !this.isSpecialistOpen}
  toggleClient(){           this.isClientOpen = !this.isClientOpen}
  toggleOnOff(){            this.isFilterOn = !this.isFilterOn}

  getColor(condition: boolean){return this.helper.getColorScheme(condition)}

  clearFilter(){ this.filter.resetAllFilters();}

  onOffFilter(){
    this.toggleOnOff();

    this.isFilterOn?
    this.filter.createFilter(this.CFilt, true): this.filter.resetCFilter();
    this.isFilterOn?
    this.filter.createFilter(this.SFilt, false): this.filter.resetSFilter()
  }

  onCFormGroupChangeEvent(event: any) {   this.CFilt = event;  }
  onSFormGroupChangeEvent(event: any) {   this.SFilt = event;  }

  getButton(condition: boolean){ return this.helper.getButton(condition)}

  onNewAdded() {    this.toggleNew(); this.isClientOpen= false; this.isSpecialistOpen = false; }

  fil(isClient: boolean){
    const f = isClient? this.CFilt : this.SFilt;
    this.filter.createFilter(f, isClient)}
}


