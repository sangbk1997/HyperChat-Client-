
import {Injectable} from "@angular/core";
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {reject} from "q";

export declare var $bean;
export declare var $;


@Injectable({
  providedIn: 'root'
})

export class BaseService {
  constructor(private http: HttpClient){

  }

  HEADER_POST = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  };

  HEADER_FORM_FILE = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': undefined
    })
  };

  HEADER_GET = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    })
  };
}
