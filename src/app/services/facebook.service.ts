import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders } from "@angular/common/http";

const headers = new HttpHeaders()
             .set('Authorization', 'Basic ' + "tbal:Summer@2019")

@Injectable()
export class FacebookService {
    
    baseUrlForMe: string = "https://graph.facebook.com/v3.2/me";
    accessToken: string = "?access_token=EAAfHSzZBmRT4BAO2u019yevzlgU4Xt9Nm2PvPOc43f8XzjT7CL1yOSIIB59QaXblF6G4xieZAMuJ2wf0kIIQ7TDqvS45bM0pMl3bW3MaWfMfHyUNe6ZAHxFyZBd2NjpBIs1OeSfOobiKBuZBvz09gWaXwDkpD2RBfnA2ZByPRxbN3T8oUkEhUWcRj5wQn1NnYZD";
    
    constructor(private http: HttpClient) {}
   
    getMessages() {
        return this.http.get(this.baseUrlForMe + this.accessToken);
    }

    getLoggedInUserFeed() {
        return this.http.get(this.baseUrlForMe + this.accessToken + "&fields=id,name,posts&format=json&method=get");
    }
}