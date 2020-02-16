import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatDividerModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatListModule,
  MatSnackBarModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule, 
  MatRippleModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatRippleModule
  ]
})
export class AngularMaterialModule {}
