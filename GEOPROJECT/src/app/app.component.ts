import {Component, OnInit} from "@angular/core";
import * as L from "leaflet";
import * as GEOJSON from "geojson";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {GeoJsonObject} from "geojson";
import {GeoJSON, GeoJSONOptions, StyleFunction} from "leaflet";
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
            const layers: GeoJSON = L.geoJSON(geojson);
            layers.addTo(map);
            map.setView(new L.LatLng(46.85, 2.3518), 6);
            map.eachLayer(function (layer: any) {
              if (layer.feature) {
                layer.setStyle({color: "#e73D3D"});
                layer.bindPopup(layer.feature.properties.nom);
                layer.on({
                  click: whenClicked
                }, {t: that, l: layer});
                layer.on("mouseover", function (e) {
                  this.setStyle({color: "#8A2424"});
                  // this.openPopup();
                });
                layer.on("mouseout", function (e) {
                  this.setStyle({color: "#e73D3D"});
                  // this.closePopup();
                });
              }

              function whenClicked() {
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
    return this.http.get("assets/regions.geojson")
      .map((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            const region: Region = new Region();
            region.code = feature.properties.code;
            region.nom = feature.properties.nom;
            region.feature = feature;
            this.regions.push(region);
          }
          console.log("REGIONS : ", this.regions);
          return true;

        }
      );
  }

  private parseGeoJsonDpt(): Observable<boolean> {
    return this.http.get("assets/departements-avec-outre-mer.geojson")
      .map((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            const dpt: Departement = new Departement();
            dpt.code = feature.properties.code;
            dpt.nom = feature.properties.nom;
            dpt.feature = feature;
            this.departements.push(dpt);
          }
          console.log("DEPARTEMENTS : ", this.departements);
          return true;
        }
      );
  }

  private parseGeoJsonCommunes(): Observable<boolean> {
    return this.http.get("assets/communes-avec-outre-mer.geojson")
      .map((res: any) => {
          const content = res.json();
          for (const feature of content.features) {
            const com: Commune = new Commune();
            com.code = feature.properties.code;
            com.nom = feature.properties.nom;
            com.feature = feature;
            this.communes.push(com);
          }
          console.log("COMMUNES : ", this.communes);
          return true;
        }
      );
  }

  private parseGeoJsonMetropoles(): Observable<boolean> {
    return this.http.get("assets/metropole.geojson")
      .map((res: any) => {
          const content = res.json();
          return true;
        }
      );
  }

  private parseGeoJson() {
     this.parseGeoJsonCommunes().subscribe(
      (result) => {
        if (result) {
          this.processCommunes();
          return  this.parseGeoJsonDpt().subscribe(
            (result2) => {
              if (result2) {
                this.processDpts();

                return this.parseGeoJsonRegion().subscribe(
                  (result3) => {
                    if (result3) {
                      this.processRegions();

                      return this.parseGeoJsonMetropoles().subscribe(
                        (result4) => {
                          if (result4) {
                            return true;
                          }
                        }
                      );
                    }
                  }
                );

              }
            }
          );
        }
      }
    );
  }


  private processCommunes() {
    console.log("COMMUNES : ", this.communes);
  }
  private processDpts() {
    console.log("DEPARTEMENTS : ", this.departements);
  }
  private processRegions() {
    console.log("REGIONS : ", this.regions);
  }
  private clickOnRegion(region: any) {
    this.region = region;
    const geojson: GeoJsonObject = region;
    const geojson2 = L.geoJSON(geojson);
    this.mapLocal.fitBounds(geojson2.getBounds());
  }

  private reset() {
    this.mapLocal.setView(new L.LatLng(46.85, 2.3518), 6);
  }
}


