import {Component, OnInit} from "@angular/core";
import * as L from "leaflet";
import * as GEOJSON from "geojson";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {GeoJsonObject} from "geojson";
import {GeoJSON, GeoJSONOptions, Layer, StyleFunction} from "leaflet";
import {Commune, Departement, Langue, Region} from "./shared/model";

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
  communesGeo: any;
  communesGeoArray: L.Layer[][] = new Array(110);
  dptGeo: any;

  region: Region = new Region();
  loading = true;
  layer: Layer;
  layers: Layer[] = new Array();

  constructor(private http: Http) {
  }

  ngOnInit() {
    let x = 0;
    while (x < this.communesGeoArray.length) {
      this.communesGeoArray[x] = new Array<L.Layer>();
      x ++;
    }
    console.log(this.communesGeoArray);
    this.options = {
      layers: [
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 12,
          minZoom: 6,
          attribution: "..."
        })
      ],
      zoom: 4,
      center: L.latLng([46.85, 2.3518])
    };

    this.parseGeoJson();
  }

  private onMapReady(map: L.Map) {
    console.log("ON MAP READY");
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
    /*        setTimeout(
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
                100);*/

    /*        const geojson: GeoJsonObject = this.communesGeo;
            const layers: GeoJSON = L.geoJSON(geojson);
            layers.addTo(map);
            map.setView(new L.LatLng(46.85, 2.3518), 6);
            map.eachLayer(function (layer: any) {
                if (layer.feature) {
                    if (layer.feature.properties.com.langue === Langue.Oc) {

                        layer.setStyle({color: "#1BBCC7"});
                        layer.on("mouseover", function (e) {
                            this.setStyle({color: "#1B7DC7"});
                            // this.openPopup();
                        });
                        layer.on("mouseout", function (e) {
                            this.setStyle({color: "#1BBCC7"});
                            // this.closePopup();
                        });
                    } else if (layer.feature.properties.com.langue === Langue.Oil) {

                        layer.setStyle({color: "#82C71B"});
                        layer.on("mouseover", function (e) {
                            this.setStyle({color: "#4D7D05"});
                            // this.openPopup();
                        });
                        layer.on("mouseout", function (e) {
                            this.setStyle({color: "#82C71B"});
                            // this.closePopup();
                        });
                    } else {
                        layer.setStyle({color: "#e73D3D"});
                        layer.on("mouseover", function (e) {
                            this.setStyle({color: "#8A2424"});
                            // this.openPopup();
                        });
                        layer.on("mouseout", function (e) {
                            this.setStyle({color: "#e73D3D"});
                            // this.closePopup();
                        });

                    }
                    layer.bindPopup(layer.feature.properties.nom);
                    layer.on({
                        click: whenClicked
                    }, {t: that, l: layer});

                }

                function whenClicked() {
                    this.t.mapLocal.fitBounds(this.l.getBounds());
                    this.t.region = this.l.feature.properties;
                }
            }, this);*/

    const geojson2: GeoJsonObject = this.dptGeo;
    const layers2: GeoJSON = L.geoJSON(geojson2);
    layers2.addTo(map);
    map.setView(new L.LatLng(46.85, 2.3518), 6);
    map.eachLayer(function (layer: any) {
      if (layer.feature) {
        if (layer.feature.properties.dpt.langue === Langue.Oc) {

          layer.setStyle({color: "#1BBCC7"});
          layer.on("mouseover", function (e) {
            this.setStyle({color: "#1B7DC7"});
            // this.openPopup();
          });
          layer.on("mouseout", function (e) {
            this.setStyle({color: "#1BBCC7"});
            // this.closePopup();
          });
        } else if (layer.feature.properties.dpt.langue === Langue.Oil) {

          layer.setStyle({color: "#82C71B"});
          layer.on("mouseover", function (e) {
            this.setStyle({color: "#4D7D05"});
            // this.openPopup();
          });
          layer.on("mouseout", function (e) {
            this.setStyle({color: "#82C71B"});
            // this.closePopup();
          });
        } else {
          layer.setStyle({color: "#e73D3D"});
          layer.on("mouseover", function (e) {
            this.setStyle({color: "#8A2424"});
            // this.openPopup();
          });
          layer.on("mouseout", function (e) {
            this.setStyle({color: "#e73D3D"});
            // this.closePopup();
          });

        }
        layer.bindPopup(layer.feature.properties.nom);
        layer.on({
          click: whenClicked
        }, {t: that, l: layer});

      }

      function whenClicked() {
        if (this.t.layer) {
          this.t.mapLocal.addLayer(this.t.layer);
        }
        if (this.t.layers.length !== 0) {
          for (const l of this.t.layers) {
            this.t.mapLocal.removeLayer(l);
          }
        }
        for (const com of this.t.communesGeoArray[this.l.feature.properties.dpt.code]){
          console.log(com);
          com.eachLayer(function(layer2: any){
            if (layer2.feature) {
              if (layer2.feature.properties.com.langue === Langue.Oc) {

                layer2.setStyle({color: "#1BBCC7"});
                layer2.on("mouseover", function (e) {
                  this.setStyle({color: "#1B7DC7"});
                  // this.openPopup();
                });
                layer2.on("mouseout", function (e) {
                  this.setStyle({color: "#1BBCC7"});
                  // this.closePopup();
                });
              } else if (layer2.feature.properties.com.langue === Langue.Oil) {

                layer2.setStyle({color: "#82C71B"});
                layer2.on("mouseover", function (e) {
                  this.setStyle({color: "#4D7D05"});
                  // this.openPopup();
                });
                layer2.on("mouseout", function (e) {
                  this.setStyle({color: "#82C71B"});
                  // this.closePopup();
                });
              } else {
                layer2.setStyle({color: "#e73D3D"});
                layer2.on("mouseover", function (e) {
                  this.setStyle({color: "#8A2424"});
                  // this.openPopup();
                });
                layer2.on("mouseout", function (e) {
                  this.setStyle({color: "#e73D3D"});
                  // this.closePopup();
                });

              }
              layer2.bindPopup(layer2.feature.properties.nom);

            }
            this.t.layers.push(layer2);
            layer2.addTo(this.t.mapLocal);
          }, this);
        }
        this.t.mapLocal.fitBounds(this.l.getBounds());
        this.t.layer = this.l;
        this.t.mapLocal.removeLayer(this.l);
        this.t.region = this.l.feature.properties;
      }
    }, this);
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
          // console.log("REGIONS : ", this.regions);
          return true;

        }
      );
  }

  private parseGeoJsonDpt(): Observable<boolean> {
    return this.http.get("assets/departements-avec-outre-mer.geojson")
      .map((res: any) => {
          const content = res.json();
          this.dptGeo = content;
          for (const feature of content.features) {
            const dpt: Departement = new Departement();
            dpt.code = feature.properties.code;
            dpt.nom = feature.properties.nom;
            dpt.feature = feature;
            let oc = 0;
            let oil = 0;
            for (const com of this.communes) {
              const match = (parseInt(dpt.code) === Math.trunc(parseInt(com.code) / 1000));
              if (match) {
                if (com.langue === Langue.Oc) {
                  oc++;
                } else if (com.langue === Langue.Oil) {
                  oil++;
                }
              }
            }
            if (oc > oil) {
              dpt.langue = Langue.Oc;
            } else if (oc < oil) {
              dpt.langue = Langue.Oil;
            } else {
              dpt.langue = Langue.Indefinie;
            }
            feature.properties.dpt = dpt;
            this.departements.push(dpt);
          }
          return true;
        }
      );
  }

  private parseGeoJsonCommunes(words: any): Observable<boolean> {
    return this.http.get("assets/communes-avec-outre-mer.geojson")
      .map((res: any) => {
          const content = res.json();
          this.communesGeo = content;
          const features = this.communesGeo.features;
          for (const feature of features) {
            const com: Commune = new Commune();
            com.code = feature.properties.code;
            com.nom = feature.properties.nom;
            // com.feature = feature;
            this.processCommune(com, words, feature);
            feature.properties.com = com;
            this.communes.push(com);
          }
          // console.log("COMMUNES : ", this.communes);
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
    this.http.get("assets/words.json").subscribe(
      (res) => {
        const words = res.json();
        this.parseGeoJsonCommunes(words).subscribe(
          (result) => {
            // console.log("parse commune", result);
            if (result) {
              return this.parseGeoJsonDpt().subscribe(
                (result2) => {
                  // console.log("parse dpt", result2);
                  if (result2) {
                    this.processDpts();

                    return this.parseGeoJsonRegion().subscribe(
                      (result3) => {
                        // console.log("parse reg", result3);
                        if (result3) {
                          this.processRegions();

                          return this.parseGeoJsonMetropoles().subscribe(
                            (result4) => {
                              // console.log("parse metr", result4);
                              if (result4) {
                                this.loading = false;
                                const that = this;
                                setTimeout(function(){ that.mapLocal.invalidateSize();
                                }, 400);
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
    );
  }

  private isLangueDOc(com: Commune, words: any): boolean {
    for (const prefix of words.oc.prefixe) {
      if (com.nom.match(new RegExp(prefix + "(^|\\s|-)", "i"))) {
        com.langue = Langue.Oc;
        return true;
      }
    }
    for (const suffix of words.oc.suffixe) {
      if (com.nom.match(new RegExp(suffix + "($|\\s|-)", "i"))) {
        com.langue = Langue.Oc;
        return true;
      }
    }
    return false;
  }

  private isLangueDOil(com: Commune, words: any): boolean {
    for (const prefix of words.oil.prefixe) {
      if (com.nom.match(new RegExp("(^|\\s|-)" + prefix, "i"))) {
        com.langue = Langue.Oil;
        return true;
      }
    }
    for (const suffix of words.oil.suffixe) {
      if (com.nom.match(new RegExp(suffix + "($|\\s|-)", "i"))) {
        com.langue = Langue.Oil;
        return true;
      }
    }
    return false;
  }

  private processCommune(com: Commune, words, feature: any) {
    const dep = Math.floor(com.code / 1000);
    const found = this.isLangueDOc(com, words);
    if (!found) {
      this.isLangueDOil(com, words);
    }

    feature.properties.com = com;
    if (this.communesGeoArray[dep]) {
      this.communesGeoArray[dep].push(L.geoJSON(feature));
    }
  }

  private processDpts() {
    // console.log("DEPARTEMENTS : ", this.departements);
  }

  private processRegions() {
    // console.log("REGIONS : ", this.regions);
  }

  private clickOnRegion(region: any) {
    this.region = region;
    const geojson: GeoJsonObject = region;
    const geojson2 = L.geoJSON(geojson);
    this.mapLocal.fitBounds(geojson2.getBounds());
  }

  private reset() {
    if (this.layer) {
      this.mapLocal.addLayer(this.layer);
      this.layer = null;
    }
    if (this.layers.length !== 0) {
      for (const l of this.layers) {
        this.mapLocal.removeLayer(l);
      }
    }
    this.mapLocal.setView(new L.LatLng(46.85, 2.3518), 6);
  }
}


