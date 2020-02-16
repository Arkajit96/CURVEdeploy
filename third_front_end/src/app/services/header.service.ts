import { Injectable } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class HeaderService {
    private notifications = [];

    // hardcode this function right now, need to figure out we to get it
    getNotifications(){
        this.notifications = ['test 1','test 2','test 3'];

        return this.notifications;
    }

}