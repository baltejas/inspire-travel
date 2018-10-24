import { Component, OnInit, Injectable } from '@angular/core';
import { MONGOLAB_BASE_URL, MONGOLAB_API_KEY } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatabaseService {
    
    aURL: string = MONGOLAB_BASE_URL + 'post-list?apiKey=' + MONGOLAB_API_KEY;

    constructor(private http: HttpClient) { }

    addPost(user_id, location) {
        return this.http.put(this.aURL, {user_id: user_id, location: location});
    }

    getPostsByUserId(user_id) {
        return this.http.get(this.aURL + "&user_id=" +user_id);
    }
}