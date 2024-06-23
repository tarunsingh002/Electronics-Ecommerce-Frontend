import {Injectable} from '@angular/core';
import {apiUrl} from '../apiutility';
import {HttpClient} from '@angular/common/http';

export interface Feedback {
  companyName: String;
  feedback: String;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  api = apiUrl;
  constructor(private http: HttpClient) {}

  recordFeedback(f: Feedback) {
    return this.http.post(`${this.api}/api/v1/feedback/add`, f);
  }
}
