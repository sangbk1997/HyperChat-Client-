import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalService} from "../../common/services/global.service";

declare var PushStream;
declare var $bean;

@Component({
  selector: 'channel-search-view-group',
  templateUrl: './channel-search-view-group.component.html',
  styleUrls: ['./channel-search-view-group.component.css']
})
export class ChannelSearchViewGroupComponent implements OnInit {
  LOCATION_SEARCH_GROUPS = 'SEARCH_GROUPS';
  DEFAULT_NUMBER_GROUP = 10;
  DEFAULT_NUMBER_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  searchChats: any = [];
  searchValue = '';
  bean = $bean;

  constructor(private http: HttpClient, private globalService: GlobalService) {
    this.searchChannels(this.DEFAULT_NUMBER_GROUP, this.DEFAULT_NUMBER_OFFSET);
  }

  ngOnInit() {
    this.globalService.searchValue.subscribe(res => {
      if ($bean.isNotEmpty(res) && res['location'] == this.LOCATION_SEARCH_GROUPS) {
        this.searchValue = res.value;
        this.searchChannels(this.DEFAULT_NUMBER_GROUP, this.DEFAULT_NUMBER_OFFSET);
      }
    })
  }

  chooseChat(chat) {
    this.globalService.accessChat.next(chat);
  }


  searchChannels(number, offset) {
    let url = this.baseUrl + 'channels/searchByUser';
    let input = {
      value: this.searchValue,
      number: number,
      offset: offset
    }
    this.http.post(url, input).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.searchChats = data;
      } else {
        this.searchChats = [];
      }
    })
  }

  getMoreSearchChats(number, offset) {
    let url = this.baseUrl + 'channels/searchByUser';
    let input = {
      value: this.searchValue,
      number: number,
      offset: offset
    }
    this.http.post(url, input).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        let tempData: any = [];
        tempData = data;
        for (let i = 0; i < tempData.length; i++) {
          this.searchChats.push(tempData[i]);
        }
      }
    })
  }

  moreSearchChats(){
    this.getMoreSearchChats(this.DEFAULT_NUMBER_GROUP, this.searchChats.length);
  }

  getNumberGroups(){

  }

}
