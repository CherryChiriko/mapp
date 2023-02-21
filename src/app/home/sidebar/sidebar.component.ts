import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { FilterService } from 'src/app/services/filter.service';

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

  constructor(private helper: HelperService, private filter: FilterService){}

  ngOnInit(): void {}

  toggleFilter(){           this.isFilterOpen = !this.isFilterOpen}
  toggleFilterSpecialist(){ this.isFilterSpecialistOpen = !this.isFilterSpecialistOpen}
  toggleFilterClient(){     this.isFilterClientOpen = !this.isFilterClientOpen}
  toggleNew(){              this.isNewOpen = !this.isNewOpen}
  toggleSpecialist(){       this.isSpecialistOpen = !this.isSpecialistOpen}
  toggleClient(){           this.isClientOpen = !this.isClientOpen}
  toggleOnOff(){            this.isFilterOn = !this.isFilterOn}
  
  getColor(condition: boolean){return this.helper.getColorScheme(condition)}

  clearFilter(){ this.filter.resetAllFilters();}

  // sFormCheck :any  = '' ;
  // cFormCheck :any  = '' ;

  CFilt: any;
  SFilt: any;

  onOffFilter(){
    this.toggleOnOff();
    this.isFilterOn? 
    this.filter.createFilter(this.CFilt, true): this.filter.resetCFilter()
  }

  onCFormGroupChangeEvent(event: any) {
    // this.cFormCheck = _event;
    console.log(event)

    this.CFilt = event;

    // this.isFilterOn? 
    // this.filter.createFilter(_event, true): this.filter.resetCFilter()

    // console.log(_event, this.cFormCheck['controls'])
    // console.log(_event)
  }

  onSFormGroupChangeEvent(_event: any) {
    // this.sFormCheck = _event;
    this.isFilterOn? 
    this.filter.createFilter(_event, true): this.filter.resetCFilter()
    // console.log(_event, this.sFormCheck['controls'])
    // console.log(_event)
  }
  
}


