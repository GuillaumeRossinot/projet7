import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const baseUrl = 'http://localhost:8080/api/user';
const adminUrl = 'http://localhost:8080/api/getUser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  modifyUser(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${adminUrl}/`);
  }

}
