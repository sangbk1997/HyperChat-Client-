import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";

declare var $bean;

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  public userLogin = new Subject<any>();
  public searchAll = new Subject<any>();
  public searchGroup = new Subject<any>();
  public searchChannels = new Subject<any>();
  public searchValue = new Subject<any>();
  public myChats = new Subject<any>();
  public suggestContacts = new Subject<any>();
  public searchChatsAndContacts = new Subject<any>();
  public infoContact = new Subject<any>();
  public infoChat = new Subject<any>();
  public listSentRequest = new Subject<any>();
  public listIncomeRequest = new Subject<any>();
  public searchChats = new Subject<any>();
  public searchPeople = new Subject<any>();
  public notifications = new Subject<any>();
  public newChannel = new Subject<any>();
  public accessChat = new Subject<any>();
  public selectedRequest = new Subject<any>();
  public changeOrderListChats = new Subject<Boolean>();
  public addUserToChat = new Subject<any>();
  public dataShowReactEmoji = new Subject<any>();
  public dataShowUsersReadMessenger = new Subject<any>();
  activitiesUser = new Subject<any>();

  constructor(private http: HttpClient) {
  }
}
