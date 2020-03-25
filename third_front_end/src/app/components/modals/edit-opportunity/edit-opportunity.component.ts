import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { CloseConfirmComponent } from '../close-confirm/close-confirm.component';
import { MatSnackBar } from '@angular/material';


// Service
import { ResearchService } from '../../../services/research.service'
import { FacultyService } from '../../../services/faculty.service'



@Component({
    selector: 'app-edit-opportunity',
    templateUrl: './edit-opportunity.component.html',
    styleUrls: ['./edit-opportunity.component.scss']
})
export class EditOpportunityComponent implements OnInit {

    //maintaning data
    faculty: any;
    opportunity: any;

    // form control
    opportunityForm: any;
    isloading = false;
    previewImg: any;
    anyChanges = false;
    imgChanged = false;
    imageData: any;
    uploadImg = false;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<EditOpportunityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private facultyService: FacultyService,
        private researchService: ResearchService
    ) {
        this.faculty = this.data.user;
        this.opportunity = this.data.opportunity;
    }

    ngOnInit() {
        if (this.opportunity) {
            this.opportunityForm = this.fb.group({
                name: [this.opportunity.name],
                icon: [],
                expireTime: [this.opportunity.expireTime],
                summary: [this.opportunity.summary]
            })
        } else {
            this.opportunityForm = this.fb.group({
                name: [],
                icon: [],
                expireTime: [],
                summary: []
            })
        }

    }

    submit() {
        if (this.uploadImg) {
            this.researchService.uploadOpportunityIcon(this.faculty._id, this.imageData)
                .then((res) => {
                    if (res.opportunity) {
                        this.opportunity = res.opportunity;
                    } else {
                        this.snackBar.open('Error uploading icon', 'Dismiss', {
                            duration: 3000,
                            panelClass: 'error-snackbar'
                        })
                    }
                    
                    this.saveForm();
                })
                .catch((e) => {
                    this.snackBar.open('Error uploading icon', 'Dismiss', {
                        duration: 3000,
                        panelClass: 'error-snackbar'
                    })
                })
        } else {
            this.saveForm();
        }
    }

    saveForm() {
        this.researchService.createOrUpdateOpportunity(
            this.faculty.user_id,
            this.opportunityForm.controls,
            this.faculty)
            .then((data) => {
                this.dialogRef.close({
                    opportunity: data.opportunity,
                    faculty: data.faculty,
                });

                this.snackBar.open('Updating opportunity successful', 'Close', {
                    duration: 3000,
                    panelClass: 'success-snackbar'
                });
            })
            .catch((e) => {
                this.snackBar.open('Error Updating opportunity', 'Dismiss', {
                    duration: 3000,
                    panelClass: 'error-snackbar'
                });
            })
    }

    newPicture(fileInput: any) {
        this.imageData = <File>fileInput.target.files[0];

        let mimeType = this.imageData.type;
        if (mimeType.match(/image\/*/) == null) {
            this.opportunityForm.patchValue({ icon: '' })
            this.snackBar.open('Must be a .png or .jpg file', 'Close', {
                duration: 3000,
                panelClass: 'error-snackbar'
            })
        } else {
            this.anyChanges = true;
            this.uploadImg = true;
        }

        this.previewProfilePic();
    }

    previewProfilePic() {
        const reader = new FileReader();
        reader.readAsDataURL(this.imageData);
        reader.onload = (_event) => {
            this.previewImg = reader.result;
        }
    }

    close() {
        if (this.anyChanges) {
            let dialogRef = this.dialog.open(CloseConfirmComponent, {
                width: "500px",
                hasBackdrop: false
            });

            dialogRef.afterClosed().subscribe(
                res => {
                    if (res) {
                        this.dialogRef.close({
                            faculty: this.faculty,
                            opportunity: this.opportunity
                        });
                    }
                }
            );
        }
        else {
            this.dialogRef.close({
                faculty: this.faculty,
                opportunity: this.opportunity
            });
        }
    }

    setChanged() {
        this.anyChanges = true;
    }


}