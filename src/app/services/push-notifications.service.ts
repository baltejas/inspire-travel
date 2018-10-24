import { Injectable } from '@angular/core';

@Injectable()
export class PushNotificationsService {
    
    public permission: Permission;
    
    constructor() {
        this.permission = this.isSupported() ? 'default' : 'denied';
    }

    public isSupported(): boolean {
        return 'Notification' in window;
    }

    requestPermission(): void {
        let self = this;
        if ('Notification' in window) {
            Notification.requestPermission(function(status) {
                return self.permission = status;
            });
        }
    }
    
    generateNotification(item: any): void {
        let options = {
            body: item.alertContent,
            icon: "../resource/images/bell-icon.png"
        };
        let notification = new Notification(item.title, options);
        notification.onclick = function (event) {
            event.preventDefault();
            window.open("http://google.com/",'_blank');
        };
        //setTimeout(notification.close.bind(notification), 7000);
    }
}

export declare type Permission = 'denied' | 'granted' | 'default';
