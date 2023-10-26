import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrontendEngineerData } from "../frontend-engineer-form/frontend-engineer-form.component";
import { ɵValue } from "@angular/forms";


const apiHeaders = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public userApiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {
  }

  public addUser(user: {
    firstName?: ɵValue<FrontendEngineerData["firstName"]>;
    lastName?: ɵValue<FrontendEngineerData["lastName"]>;
    dateOfBirth?: ɵValue<FrontendEngineerData["dateOfBirth"]>;
    framework?: ɵValue<FrontendEngineerData["framework"]>;
    frameworkVersion?: ɵValue<FrontendEngineerData["frameworkVersion"]>;
    email?: ɵValue<FrontendEngineerData["email"]>
    hobbies?: ɵValue<FrontendEngineerData["hobbies"]>;

  }): Observable<FrontendEngineerData> {
    return this.http.post<FrontendEngineerData>(this.userApiUrl, user, apiHeaders);
  }

  public checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<FrontendEngineerData[]>(`${this.userApiUrl}?email=${email}`)
      .pipe(
        map(users => users.length > 0)
      );
  }

}

