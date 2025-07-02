import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {DialogoGenericoComponent} from "./shared/modals/dialogo-generico/dialogo-generico.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideAnimationsAsync(),{provide: MAT_DIALOG_DATA, useValue: {}},{ provide: MatDialogRef, useValue: {} } ,DialogoGenericoComponent, provideAnimationsAsync()]
};
