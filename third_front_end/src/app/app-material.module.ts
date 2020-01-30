import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatAutocompleteModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatAutocompleteModule,
  ]
})
export class AngularMaterialModule {}
