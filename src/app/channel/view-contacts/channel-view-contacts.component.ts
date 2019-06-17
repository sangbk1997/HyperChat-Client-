import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;

@Component({
  selector: 'channel-view-contacts',
  templateUrl: './channel-view-contacts.component.html',
  styleUrls: ['./channel-view-contacts.component.css']
})
export class ChannelViewContactsComponent implements OnInit {
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  suggestContacts: any = [];
  numberAbleContacts: number = 0;
  bean = $bean;
  DEFAULT_NUMBER_CONTACTS = 10;
  DEFAULT_OFFSET_CONTACT = 0;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.listContacts(this.DEFAULT_NUMBER_CONTACTS, this.DEFAULT_OFFSET_CONTACT);
    this.countAllUsers();
  }

  countAllUsers() {
    let url = this.baseUrl + 'users/countAll';
    let form = {};
    this.http.post(url, form).subscribe(data => {
      if (data['count'] >= 1) {
        this.numberAbleContacts = data['count'] - 1;
      }
      console.log('Count users');
      console.log(data);
    })
  }

  chooseContact(contact) {
    this.globalService.accessChat.next(contact);
  }

  listContacts(number, offset) {
    const url = this.baseUrl + 'users/suggested';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.suggestContacts = data;
      }
    });
  }

  getMoreContacts(number, offset) {
    const url = this.baseUrl + 'users/suggested';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        let tempData: any = [];
        tempData = data;
        for (let i = 0; i < tempData.length; i++) {
          this.suggestContacts.push(tempData[i]);
        }
      }
    });
  }

  moreContacts() {
    this.getMoreContacts(this.DEFAULT_NUMBER_CONTACTS, this.suggestContacts.length);
  }
}
