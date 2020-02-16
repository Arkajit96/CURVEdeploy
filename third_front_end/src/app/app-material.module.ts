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
  ]
})
export class AngularMaterialModule {}
