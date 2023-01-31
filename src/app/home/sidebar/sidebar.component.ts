import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  reactiveForm !: FormGroup;
  add(){
    const val = this.reactiveForm.value;
    
    // this.addMarker({ "lat": 43.48, "lng": 1.68})
    // val.name !== null  ? this.profile.name = val.name : null;
    // val.species !== null  ? this.profile.species = val.species : null;
    // val.country !== null  ? this.profile.country = val.country : null;    
    // val.city !== null  ? this.profile.city = val.city : null;
    // val.email !== null && this.reactiveForm.valid ? this.profile.email = val.email : null;
  }
}
