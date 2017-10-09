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

  regions: string[] = [];



  constructor(private http: Http) {
  }
  ngOnInit() {

    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 4,
      center: L.latLng([ 46.85, 2.3518 ])
    };

    this.parseGeoJson();
  }

 private onMapReady(map: L.Map) {
    const that = this;
    setTimeout(
        function() {
          that.http.get('assets/regions.geojson')
              .subscribe((res: any) => {
                const geojson: GeoJsonObject = res.json();
                L.geoJSON(geojson, {
                  style: function(feature) {
                    switch (feature.properties.code) {
                      case '53': return {color: "#ff0000"};
                    }
                  }
                }).addTo(map);
                console.log("geojson", geojson);
                map.setView(new L.LatLng(46.85, 2.3518), 6);
                map.eachLayer(function(layer: any){
                    console.log(layer);
                    if (layer.feature) {
                        layer.bindPopup(layer.feature.properties.nom);
                    }
                });
              });
        },
        100);
  }

  private parseGeoJson() {
    this.http.get('assets/regions.geojson')
        .subscribe((res: any) => {
            const content = res.json();
            console.log(content);
            for (let feature of content.features) {
                this.regions.push(feature.properties);
            }
        }
        );
  }
}


