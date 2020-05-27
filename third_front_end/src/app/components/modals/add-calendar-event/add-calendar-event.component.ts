import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

// Components
import { CloseConfirmComponent } from '../../modals/close-confirm/close-confirm.component';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
    selector: 'app-add-calendar-event',
    templateUrl: './add-calendar-event.component.html',
    styleUrls: ['./add-calendar-event.component.scss']
})

export class AddCalendarEventComponent implements OnInit {

    private eventForm: any;
    private currentEvent: any;
    private isloading = true;
    private anyChanges = false;


    constructor(
        private closeDialog: MatDialog,
        public dialogRef: MatDialogRef<AddCalendarEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private calendarService: CalendarService
    ) { }


    ngOnInit() {

        this.eventForm = this.fb.group({
            event_name: [''],
            organizer: [''],
            start_time: [''],
            end_time: ['']
        })

        this.isloading = false;
    }

    onSubmit() {
        this.dialogRef.close();
        this.calendarService.createEvent(this.eventForm)
        .then((data) => {
            this.dialogRef.close({'reload': true, 'event': data});
        })
        .catch((er) => {
            this.dialogRef.close({'error': er});
        })
    }

    setChanged() {
        this.anyChanges = true;
    }

    close() {
        if (this.anyChanges) {
            let closeDialogRef = this.closeDialog.open(CloseConfirmComponent, {
                width: "500px"
            });

            closeDialogRef.afterClosed().subscribe(
                res => {
                    if (res) {
                        this.dialogRef.close();
                    }
                }
            );
        }else{
            this.dialogRef.close();
        }
    }

}