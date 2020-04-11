import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Service
import { AuthService } from './auth.service';
import { StudentService } from './student.service';
import { FacultyService } from './faculty.service';
import { ConfigService } from './config.service';



@Injectable({ providedIn: 'root' })
export class HeaderService {
    constructor(
        private authService : AuthService,
        private studentService: StudentService,
        private facultyService: FacultyService,
        private config: ConfigService
      ) { }

    private url = this.config.getURL();

 
    getShoppingCartItems(){
        let observable =  new Observable<any>(observer => {
            observer.next(this.studentService.getCurrentStudentUser().shopping_cart)
        })

        return observable;
    }
}