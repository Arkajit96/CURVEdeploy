import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatDividerModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatPaginatorModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatListModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule, 
  MatRippleModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatTableModule,
  MatFormFieldModule,
  MatTooltipModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    MatMomentDateModule
  ],
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
    MatSortModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatRippleModule,
    MatTableModule,
    MatFormFieldModule,
    MatTooltipModule
  ]
})
export class AngularMaterialModule {}
