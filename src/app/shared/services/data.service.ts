import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../Config';

@Injectable()
export class DataService {
  private config: Config;
  baseUrl: string;
  header: HttpHeaders;
  multiPartFormHeader: HttpHeaders;
  public maxPageReached = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    this.config = new Config();
    this.baseUrl = this.config.baseUrl;
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    this.multiPartFormHeader = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
  }

  getDataFromUrl(urlRest: string): Observable<any[]> {
    const url = this.baseUrl + urlRest;

    // console.log(url);

    return this.http.get<any[]>(url, {headers: this.header}).pipe(map(
        (results) => results));
  }

  postAnyData(urlEnd: string, body: any) {
    const url = this.baseUrl + urlEnd;
    return this.http.post(url, body,  { headers: this.header }).pipe(map(
      (results) => results));
  }

  postMultiPartData(urlEnd: string, formData: FormData) {
    const url = this.baseUrl + urlEnd;
    return this.http.post(url, formData,  { headers: this.multiPartFormHeader }).pipe(map(
      (results) => results));
  }

  putAnyData(urlEnd: string, body: any) {
    const url = this.baseUrl + urlEnd;
    return this.http.put(url, body,  { headers: this.header }).pipe(map(
      (results) => results));
  }

  putMultiPartData(urlEnd: string, formData: FormData) {
    const url = this.baseUrl + urlEnd;
    return this.http.put(url, formData,  { headers: this.multiPartFormHeader }).pipe(map(
      (results) => results));
  }

  deleteData(urlEnd: string, id: number) {
    const url = this.baseUrl + urlEnd + '/' + id;
    return this.http.delete(url, { headers: this.header }).pipe(map(
      (results) => results));
  }

  postImage(imageData: {id: number, title: string, file: any}): Observable<any> {
    const url = this.baseUrl + 'images';
    const formData = new FormData();
    if (imageData != null && imageData.id != null) {
      formData.append('id', imageData.id + '');
    }

    if (imageData != null && imageData.title != null) {
      formData.append('title', imageData.title);
    } else {
      formData.append('title', 'bfcc_' + Math.round(Math.random() * 100000000));
    }

    formData.append('fileupload', imageData.file);
    return this.http.post(url, formData).pipe(map(
        (results) => results));
  }
}
