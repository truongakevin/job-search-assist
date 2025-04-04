import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5687/api/generate';

  constructor(private http: HttpClient) { }

  generateCoverLetter(resume: string, jobDescription: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { resume, jobDescription });
  }
}