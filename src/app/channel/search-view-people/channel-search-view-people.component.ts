import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../common/services/global.service";

declare var PushStream;
declare var $bean;

@Component({
  selector: 'channel-search-view-people',
  templateUrl: './channel-search-view-people.component.html',
  styleUrls: ['./channel-search-view-people.component.css']
})
export class ChannelSearchViewPeopleComponent implements OnInit {
  LOCATION_SEARCH_PEOPLE = 'SEARCH_PEOPLE';
  DEFAULT_NUMBER_PEOPLE = 10;
  DEFAULT_NUMBER_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  searchPeople: any = [];
  countSearch: number = 0;
  bean = $bean;
  searchValue = '';

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
    this.searchListPeople(this.DEFAULT_NUMBER_PEOPLE, this.DEFAULT_NUMBER_OFFSET);
    this.getCountSearch();
  }

  ngOnInit() {
    this.globalService.searchValue.subscribe(res => {
      if ($bean.isNotEmpty(res) && (res['location'] == this.LOCATION_SEARCH_PEOPLE)) {
        this.searchValue = res.value;
        this.getCountSearch();
        this.searchListPeople(this.DEFAULT_NUMBER_PEOPLE, this.DEFAULT_NUMBER_OFFSET);
      }
    })
  }

  getCountSearch() {
    let url = this.baseUrl + 'users/countSearch';
    let input = {
      value: this.searchValue
    }
    this.http.post(url, input).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.countSearch = data['count'];
      }
    })
  }

  choosePerson(person) {
    this.globalService.accessChat.next(person);
  }

  searchListPeople(number, offset) {
    let url = this.baseUrl + 'users/searchAll';
    let input = {
      value: this.searchValue,
      number: number,
      offset: offset
    }
    this.http.post(url, input).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.searchPeople = data;
      } else {
        this.searchPeople = [];
      }
    })
  }

  getMoreSearchPeople(number, offset) {
    let url = this.baseUrl + 'users/searchAll';
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
          this.searchPeople.push(tempData[i]);
        }
      }
    })
  }

  moreSearchPeople() {
    this.getMoreSearchPeople(this.DEFAULT_NUMBER_PEOPLE, this.searchPeople.length);
  }

  getNumberOfPeople() {

  }
}
