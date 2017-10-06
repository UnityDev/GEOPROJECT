import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import * as GEOJSON from 'geojson';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {GeoJsonObject} from "geojson";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';


  options = null;
  drawOptions = null;
  mapLocal: L.Map = null;

  fileContent;



  constructor(private http: Http) {
  }
  ngOnInit() {

    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: L.latLng([ 46.879966, -121.726909 ])
    };
  }

 onMapReady(map: L.Map) {
    const that = this;
    setTimeout(
        function() {
          that.http.get('assets/regions.geojson')
              .subscribe((res: any) => {
                const geojson: GeoJsonObject = res.json();
                L.geoJSON(geojson).addTo(map);
                console.log("MAP", map);
              });
        },
        5000);
  }
}


