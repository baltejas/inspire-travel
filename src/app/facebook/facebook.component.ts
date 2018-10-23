import { Component} from '@angular/core';
import { PushNotificationsService } from '../services/push-notifications.service';
import { FacebookService } from '../services/facebook.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent {
  
  constructor(private _notificationService: PushNotificationsService, private _facebookService: FacebookService) {
      this._notificationService.requestPermission();
  }

  notify() {
    let data = {
        'title': 'Lets Travel',
        'alertContent': 'Click here for the best air fare to NYC !!'
    };
    this._notificationService.generateNotification(data);
    this.getMessages();
  }

  getMessages() {
    this._facebookService.getMessages().subscribe((results) => {
        console.log(results);
    });
  }
 
}
