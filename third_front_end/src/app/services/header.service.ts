import { Injectable } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class HeaderService {
    private notifications = [];

    // hardcode this function right now, need to figure out we to get it
    getNotifications(){
        this.notifications = [];
        this.notifications.push("test 1");
        this.notifications.push("test 2");
        this.notifications.push("test 3");

        return this.notifications;
    }

}