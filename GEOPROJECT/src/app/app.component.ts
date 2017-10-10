import {Component, OnInit} from "@angular/core";
import * as L from "leaflet";
import * as GEOJSON from "geojson";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {GeoJsonObject} from "geojson";
import {GeoJSONOptions, StyleFunction} from "leaflet";
import {Commune, Departement, Region} from "./shared/model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  options = null;
  drawOptions = null;
  mapLocal: L.Map = null;

  fileContent;

  regions: Region[] = [];
  departements: Departement[] = [];
  communes: Commune[] = [];

  region: Region = new Region();


  constructor(private http: Http) {
  }

  ngOnInit() {

    this.options = {
      layers: [
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom: 12, minZoom: 6, attribution: "..."})
      ],
      zoom: 4,
      center: L.latLng([46.85, 2.3518])
    };

    this.parseGeoJson();
  }

  private onMapReady(map: L.Map) {
    const that = this;
    this.mapLocal = map;
    this.http.get("assets/metropole.geojson")
      .subscribe((res: any) => {
        const geojson: GeoJsonObject = res.json();
        const poly: L.GeoJSON = L.geoJSON(geojson);
        map.fitBounds(poly.getBounds());
        // map.setMaxBounds(poly.getBounds());
        // map.options.minZoom = map.getZoom();
      });
    setTimeout(
      function () {
        that.http.get("assets/regions.geojson")
          .subscribe((res: any) => {
            const geojson: GeoJsonObject = res.json();
            L.geoJSON(geojson
              /* , {
               style: function (feature) {
                   switch (feature.properties.code) {
                       case '53':
                           return {color: "#ff0000"};
                   }
               }
           }*/
            ).addTo(map);
            console.log("geojson", geojson);
            map.setView(new L.LatLng(46.85, 2.3518), 6);
            map.eachLayer(function (layer: any) {
              if (layer.feature) {
                layer.bindPopup(layer.feature.properties.nom);
                layer.on({
                  click: whenClicked
                }, {t: that, l: layer});
                layer.on("mouseover", function (e) {
                  this.openPopup();
                });
                layer.on("mouseout", function (e) {
                  this.closePopup();
                });
              }

              function whenClicked() {
                console.log(this);
                this.t.mapLocal.fitBounds(this.l.getBounds());
                this.t.region = this.l.feature.properties;
              }
            }, this);

          });
      },
      100);
    map.dragging.disable();
  }

  private parseGeoJsonRegion() {
    this.http.get("assets/regions.geojson")
      .subscribe((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            console.log(feature);
            const region: Region = new Region();
            region.code = feature.properties.code;
            region.nom = feature.properties.nom;
            region.feature = feature;
            this.regions.push(region);
          }
        }
      );
  }

  private parseGeoJsonDpt() {
    this.http.get("assets/departements-avec-outre-mer.geojson")
      .subscribe((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            const dpt: Departement = new Departement();
            dpt.code = feature.properties.code;
            dpt.nom = feature.properties.nom;
            dpt.feature = feature;
            this.departements.push(dpt);
          }
        }
      );
  }

  private parseGeoJsonCommunes() {
    this.http.get("assets/communes-avec-outre-mer.geojson")
      .subscribe((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            const com: Commune = new Commune();
            com.code = feature.properties.code;
            com.nom = feature.properties.nom;
            com.feature = feature;
            this.communes.push(com);
          }
        }
      );
  }

  private parseGeoJsonMetropoles() {
    this.http.get("assets/metropole.geojson")
      .subscribe((res: any) => {
          const content = res.json();
          console.log("METROPOLE", content);
        }
      );
  }

  private parseGeoJson() {
    this.parseGeoJsonCommunes();
    this.parseGeoJsonDpt();
    this.parseGeoJsonRegion();
    this.parseGeoJsonMetropoles();
  }


  private clickOnRegion(region: any) {
    this.region = region;
    console.log(region);
    const geojson: GeoJsonObject = region;
    const geojson2 = L.geoJSON(geojson);
    this.mapLocal.fitBounds(geojson2.getBounds());
  }

  private reset() {
    this.mapLocal.setView(new L.LatLng(46.85, 2.3518), 6);
  }
}


