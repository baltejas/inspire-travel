import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders } from "@angular/common/http";

const headers = new HttpHeaders()
             .set('Authorization', 'Basic ' + "tbal:Summer@2019")

@Injectable()
export class FacebookService {
    
    baseUrl: string = "https://graph.facebook.com/v3.1/me";
    test: string = "?access_token=EAAfHSzZBmRT4BAChpNRWxltXNU51czUhlk0R70IK8BYea9cUZCeqZCXwUqr9apZCjZAy6Lur5AMF4SaJ2iHPOOFjCwPfvEPsKMkmBmUhhjDcQs9iVOEe4wtrM4QumwOK6CZCmADZBqS5YAq4gtt9StN8bpG84uosc3rQCEbCtxsRiC7Y8EE4gpZBDSSupLbbnmwZD"
    
    constructor(private http: HttpClient) {}
   
    getMessages() {
        return this.http.get(this.baseUrl + this.test);
    }
}