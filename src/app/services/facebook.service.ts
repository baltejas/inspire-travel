import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders } from "@angular/common/http";

const headers = new HttpHeaders()
             .set('Authorization', 'Basic ' + "tbal:Summer@2019")

@Injectable()
export class FacebookService {
    
    baseUrlForMe: string = "https://graph.facebook.com/v3.2/me";
    //accessToken: string = "?access_token=EAAfHSzZBmRT4BAHZCEpyFQSIsP0njiCNCu5nfyLu3U9x2tLIZBuCuDuZBdymb1NnLaAuvdVZAMwQpBOUbz6u7vGz3kme1EATCD93eQNQinkJuc1H9wzMFEZBvb624ZBxfUUj2ByxwnQftX8hKHIKiZARfsLj7SKxwO9WGDB0dxuY5T2p3uQPA4RZAnSiqrv3yRk7VieZClnkhJzLTDzZAjbSSdn4U2NmtDs9nU5IQNpLYTf2wZDZD";
    
    constructor(private http: HttpClient) {}
   
    getLoggedInUserFeed(accessToken) {
        return this.http.get(this.baseUrlForMe + "?access_token=" + accessToken + "&fields=id,name,posts&format=json&method=get");
    }

    getFriends(accessToken) {
        return this.http.get(this.baseUrlForMe + "?access_token=" + accessToken + "&fields=id,friends");
    }
}