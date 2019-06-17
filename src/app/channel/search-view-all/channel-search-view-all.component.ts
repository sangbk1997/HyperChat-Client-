import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../common/services/global.service";

declare var PushStream;
declare var $bean;

@Component({
  selector: 'channel-search-view-all',
  templateUrl: './channel-search-view-all.component.html',
  styleUrls: ['./channel-search-view-all.component.css']
})
export class ChannelSearchViewAllComponent implements OnInit {
  LOCATION_SEARCH_ALL = 'SEARCH_ALL';
  DEFAUTL_NUMBER_CHAT = 10;
  DEFAULT_NUMBER_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  listPeople = [];
  listChats = [];
  searchChatsAndContacts: any = {
    listChats: [],
    listContacts: []
  };
  searchValue = '';
  bean = $bean;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
    this.searchPeopleChats(this.DEFAUTL_NUMBER_CHAT, this.DEFAULT_NUMBER_OFFSET);
  }

  ngOnInit() {
    this.globalService.searchValue.subscribe(res => {
      if ($bean.isNotEmpty(res) && res['location'] == this.LOCATION_SEARCH_ALL) {
        this.searchValue = res.value;
        this.searchPeopleChats(this.DEFAUTL_NUMBER_CHAT, this.DEFAULT_NUMBER_OFFSET);
      }
    })
  }

  chooseChat(chat) {
    this.globalService.accessChat.next(chat);
  }

  searchPeopleChats(number, offset) {
    let url = this.baseUrl + 'users/searchAll';
    let inputBound = {
      value: this.searchValue,
      number: number,
      offset: offset
    }
    this.http.post(url, inputBound).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        if ($bean.isNotEmpty(data)) {
          this.searchChatsAndContacts.listChats = data[0];
          this.searchChatsAndContacts.listContacts = data[1];
        }
      } else {
        this.searchChatsAndContacts.listContacts = [];
        this.searchChatsAndContacts.listChats = [];
      }
    })
  }

  getMoreChats() {
    this.router.navigate(['/search?filter=groups']);
  }

  getMoreContacts() {
    this.router.navigate(['/search?filter=people']);
  }

}
