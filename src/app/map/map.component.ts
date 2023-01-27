import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  center: google.maps.LatLngLiteral = {lat: 44.4949, lng: 11.3426};
  zoom = 4;
}
