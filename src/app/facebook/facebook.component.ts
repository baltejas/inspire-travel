import { Component} from '@angular/core';
import { PushNotificationsService } from '../services/push-notifications.service';
import { FacebookService } from '../services/facebook.service';
import { DatabaseService } from '../services/database.service';

declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent {
  
  isLoggedIn: boolean = false;

  private accessToken : string;

  private userPosts: any = [];

  constructor(private _notificationService: PushNotificationsService, 
              private _facebookService: FacebookService,
              private _databaseService: DatabaseService) {
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

  notify(suggestion: string) {
    let data = {
        'title': 'Lets Travel',
        'alertContent': suggestion
    };
    this._notificationService.generateNotification(data);
  }

  login() {
    let that = this;
    FB.login(function(response) {
      if (response.status === 'connected') {
        that.accessToken = response.authResponse.accessToken;
       } else {
        //
      }
    });
    this.isLoggedIn = true;
  }

  getPosts() {
    setInterval(()=> {
      this.getLoggedInUserPosts(); 
    }, 5000); 
    this.getFriendsPosts();
  }
  
  getLoggedInUserPosts() {
    this._facebookService.getLoggedInUserFeed(this.accessToken).subscribe((results) => {
      if(results["posts"] != undefined) {
        let posts:[] = results["posts"]["data"];
        posts.forEach(element => {
         let message: string = element["message"];
         if(message.indexOf("travel") > -1) {
           // Push to database
           // need to check if post already in db
           let words: string[] = message.split(" ");
           this._databaseService.addPost(results["id"], words[words.length - 1]).subscribe();
         }
        });
      }
    });
  }

  getFriendsPosts() {
    this._facebookService.getFriends(this.accessToken).subscribe((results) => {
      console.log(results);
      let friends:[] = results["friends"]["data"];
      friends.forEach(element => {
        this._databaseService.getPostsByUserId(element["id"]).subscribe((data) => {
          let post: any = data;
          post.forEach(e => {
            let suggestion: string = "Travel to " + e["location"] + " at the best price";
            this.userPosts.push(suggestion);
            this.notify(suggestion);
          })
        })
      })
  });
  }
 
}
