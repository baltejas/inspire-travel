import { Component} from '@angular/core';
import { PushNotificationsService } from '../services/push-notifications.service';
import { FacebookService } from '../services/facebook.service';

declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent {
  
  private isLoggedIn: boolean = false;

  constructor(private _notificationService: PushNotificationsService, private _facebookService: FacebookService) {
      this._notificationService.requestPermission();

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

       window.fbAsyncInit = function() {
        FB.init({
          appId      : '2189450841310526',
          xfbml      : true,
          version    : 'v3.1'
        });
        FB.AppEvents.logPageView();
      };
      
  }

  notify() {
    let data = {
        'title': 'Lets Travel',
        'alertContent': 'Click here for the best air fare to NYC !!'
    };
    this._notificationService.generateNotification(data);
    this.getMessages();
  }

  login() {
    FB.login(function(response) {
      if (response.status === 'connected') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  getMessages() {
    this._facebookService.getMessages().subscribe((results) => {
        console.log(results);
    });
  }
 
}
