import { Component } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  INITIAL_COORDS = [44.4949, 11.3426]; // Bologna
  center: google.maps.LatLngLiteral = { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]};
  zoom = 4;

  markers = [
  {
    position: { lat: 38.9987208, lng: -77.2538699 },
    info: {
      name: "Great Falls",
      direction: "Potomac, MD 20854, United States"
    }
  },
  {
    position: { lat: 39.7, lng: -76.0 },
    info: {
      name: "Grove Farm Wildlife Management Area",
      direction: "1989-2103 Grove Neck Rd, Earleville, MD 21919, United States"
    }
  },
  {
    position: { lat: 37.9, lng: -76.8 },
    info: {
      name: "Virginia",
      direction: "Virginia, United States"
    }
  },
  {
    position: { lat: this.INITIAL_COORDS[0], lng: this.INITIAL_COORDS[1]},
    info: {
      name: "Bologna",
      direction: "Bologna, Italy"
    }
  }
]

public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
  infoWindow.open(marker);
}
}
