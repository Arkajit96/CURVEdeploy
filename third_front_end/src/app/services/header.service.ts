import { Injectable } from '@angular/core';

// Service
import { AuthService } from './auth.service';
import { StudentService } from './student.service';
import { FacultyService } from './faculty.service';



@Injectable({ providedIn: 'root' })
export class HeaderService {
    private notifications = [];

    constructor(
        private authService : AuthService,
        private studentService: StudentService,
        private facultyService: FacultyService,
      ) { }

    // hardcode this function right now, need to figure out we to get it
    getNotifications(){
        this.notifications = ['test 1','test 2','test 3'];
        return this.notifications;
    }

    getShoppingCartItems(){
        return this.studentService.getCurrentStudentUser().shopping_cart;
    }

}