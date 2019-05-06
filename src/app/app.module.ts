import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InstitutionModule } from './pages/institution/institution.module';
import { HeaderModule } from './components/header/header.module';
import { ModeratorModule } from './pages/moderator/moderator.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InstitutionModule,
    ModeratorModule,
    HeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
