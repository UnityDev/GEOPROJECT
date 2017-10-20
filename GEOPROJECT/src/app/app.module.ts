import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatProgressSpinnerModule} from "@angular/material";
import {MatSidenavModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
