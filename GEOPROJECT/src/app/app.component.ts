import {Component, OnInit} from "@angular/core";
import * as L from "leaflet";
import * as GEOJSON from "geojson";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {GeoJsonObject} from "geojson";
import {GeoJSON, GeoJSONOptions, StyleFunction} from "leaflet";
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

    region: Region = new Region();
    loading = true;

    constructor(private http: Http) {
    }

    ngOnInit() {

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

        const geojson: GeoJsonObject = this.communesGeo;
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
                    for (const feature of content.features) {
                        const dpt: Departement = new Departement();
                        dpt.code = feature.properties.code;
                        dpt.nom = feature.properties.nom;
                        dpt.feature = feature;
                        this.departements.push(dpt);
                    }
                    // console.log("DEPARTEMENTS : ", this.departements);
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
                        this.processCommune(com, words);
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
            if (com.nom.match(new RegExp("(^|\\s|-)" + prefix, "i"))) {
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

    private processCommune(com: Commune, words) {

        const found = this.isLangueDOc(com, words);
        if (!found) {
            this.isLangueDOil(com, words);
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
        this.mapLocal.setView(new L.LatLng(46.85, 2.3518), 6);
    }
}


