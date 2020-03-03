import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatDialog, MatDialogConfig } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material';

// Models
import { Faculty } from '../../shared/faculty';

// Components
import { submitApplicationComponent } from '../modals/submit-application/submit-application.component'
import { submitAllApplicationComponent } from '../modals/submit-all-application/submit-all-application.component'
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component'


// Service
import { StudentService } from '../../services/student.service';
import { ResearchService } from '../../services/research.service';


@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
    isLoading = false;

    //Fields for shopping cart
    student: any;
    private shopping_cart = [];

    // data control
    dataSource = new MatTableDataSource<Faculty>([]);
    selection = new SelectionModel<Faculty>(true, []);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    // columns that we want to display
    columnsToDisplay: string[] = ['select', 'name', 'department', 'email', 'actions'];


    constructor(
        private researchService: ResearchService,
        private studentService: StudentService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.student = this.studentService.getCurrentStudentUser();
        this.studentService.getShoppingCartItemsByIds(this.student.shopping_cart)
            .then(res => {
                this.shopping_cart = res.items;
                console.log(this.shopping_cart);
                this.dataSource = new MatTableDataSource<Faculty>(this.shopping_cart);

                //add pagenation
                this.dataSource.paginator = this.paginator;

                this.isLoading = false;
            })


        // retrive data from backend
        // const userId = this.authService.getUserId();
        // this.studentService.getStudentByUserId(userId)
        //     .then((res) => {
        //         this.student = res;
        //         this.studentService.getShoppingCartItemsByIds(this.student.shopping_cart)
        //         .then(res => {
        //             this.shopping_cart = res.items;
        //             console.log(this.shopping_cart);

        //             this.dataSource = new MatTableDataSource<Application>(this.shopping_cart);
        //         })

        //         //add pagenation
        //         this.dataSource.paginator = this.paginator;

        //         this.isLoading = false;
        //     });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    // View faculty profile
    ViewProfile() {
        this.dialog.open(ViewStudentProfileComponent, {
            data: { Data: this.student },
        })
    }

    // Find opt by Id
    findOptAndOpenDialog(optID: string) {
        this.researchService.getOptByIds(this.student._id, optID)
            .then(data => {
                this.openApplicationDialog(data);
            });
    }

    // Handle application submit dialog
    openApplicationDialog(data: any) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.width = "200em";
        dialogConfig.data = {
            opt: data.currentOpt,
            student: this.student,
            application: data.application
        }

        let dialogRef = this.dialog.open(submitApplicationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.deleteItem(data.currentOpt._id);
                this.snackbar.open('Application submitted', 'Close', {
                    duration: 3000,
                    panelClass: 'success-snackbar'
                })
            }
        })
    }

    addToShoppingCart(person: any) {
        this.studentService.addToShoppingCart(this.student.user_id, person._id)
            .then(res => {
                this.student = res.student;
                this.shopping_cart = res.student.shopping_cart;
                this.snackbar.open('Faculty ' + person.first_name + ' added to the shopping cart', 'Close', {
                    duration: 3000,
                    panelClass: 'success-snackbar'
                })
            });
    }

    // Delete from the pending application
    deleteItem(id: string) {
        this.studentService.deleteItem(this.student.user_id, id)
            .then(res => {
                this.student = res.student;
                this.studentService.getShoppingCartItemsByIds(this.student.shopping_cart)
                    .then(res => {
                        this.shopping_cart = res.items;
                        this.dataSource = new MatTableDataSource<any>(this.shopping_cart);
                    })
                this.snackbar.open('Item deleted', 'Close', {
                    duration: 3000,
                    panelClass: 'success-snackbar'
                })
            });
    }

    // submit all items
    submitAll() {
        const itemList = this.selection.selected;
        if (itemList.length > 0) {

            const optIdList = itemList.map(function (item, index, input) {
                return item.opportunity;
            })

            const dialogConfig = new MatDialogConfig();

            dialogConfig.autoFocus = false;
            dialogConfig.width = "200em";
            dialogConfig.data = {
                optIds: optIdList,
                student: this.student
            }

            let dialogRef = this.dialog.open(submitAllApplicationComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(res => {
                if (res) {
                    this.snackbar.open('All application submitted', 'Close', {
                        duration: 3000,
                        panelClass: 'success-snackbar'
                    })

                }
            })
        }
    }
}