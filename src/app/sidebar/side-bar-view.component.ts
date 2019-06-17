import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'side-bar-view',
  templateUrl: './side-bar-view.component.html',
  styleUrls: ['./side-bar-view.component.css']
})
export class SideBarViewComponent implements OnInit {

  LOCATION_DEFAULT = 'HOME_CHAT';
  LOCATION_HOME_CHAT = 'HOME_CHAT';
  LOCATION_HOME_CONTACTS = 'HOME_CONTACTS';
  LOCATION_HOME_NOTIFICATIONS = 'HOME_NOTIFICATIONS';
  LOCATION_HOME_INCOME_REQUEST = 'HOME_INCOME_REQUEST';
  LOCATION_SEARCH_ALL = 'SEARCH_ALL';
  LOCATION_SEARCH_PEOPLE = 'SEARCH_PEOPLE';
  LOCATION_SEARCH_GROUPS = 'SEARCH_GROUPS';
  DEFAULT_NUMBER_CHAT = 10;
  DEFAULT_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  userLogin: any = {};
  suggestContacts: any = [];
  searchValue: string = '';
  activitiesUser = {
    isSearching: false,
    value: '',
    location: this.LOCATION_DEFAULT
  };

  numberNotifications: number = 0;
  listNotifications: any = [];

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {

  }

  ngOnInit() {
    this.globalService.userLogin.subscribe(data => {
      this.userLogin = data;
    })
  }

  search() {
    this.activitiesUser.value = this.searchValue;
    this.globalService.searchValue.next(this.activitiesUser);
  }

  goToChats() {
    this.activitiesUser.location = this.LOCATION_HOME_CHAT;
  }

  //
  goToContacts() {
    this.activitiesUser.location = this.LOCATION_HOME_CONTACTS;
  }

  //
  goToSearchAll() {
    this.activitiesUser.location = this.LOCATION_SEARCH_ALL;
  }

  //
  goToSearchPeople() {
    this.activitiesUser.location = this.LOCATION_SEARCH_PEOPLE;
  }

  //
  goToSearchGroup() {
    this.activitiesUser.location = this.LOCATION_SEARCH_GROUPS;
  }

  goToIncomeRequest() {
    this.activitiesUser.location = this.LOCATION_HOME_INCOME_REQUEST;
    this.showIncomeRequest();
  }

  getNumberNotify() {
    let url = this.baseUrl + 'user/numberNotifications';
    this.http.get(url).subscribe(result => {
      if ($bean.isNotEmpty(result)) {
        this.numberNotifications = result['value'];
      }
    })
  }

  loadNotifications() {
    let url = this.baseUrl + 'users/listNotifications';
    this.http.get(url).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.globalService.notifications.next(data);
      }
    })
  }

  showIncomeRequest() {
    let url = this.baseUrl + 'users/listIncomeRequest';
    let form = {
      number: null,
      offset: null
    }
    this.http.post(url, form).subscribe(data => {
      $('#modalBoxRequest').modal('show');
      this.globalService.listIncomeRequest.next(data);
    })
  }


  showSentRequest() {
    let url = this.baseUrl + 'users/listSentRequest';
    let form = {
      number: null,
      offset: null
    }
    this.http.post(url, form).subscribe(data => {
      $('#modalBoxRequest').modal('show');
      this.globalService.listSentRequest.next(data);
    })
  }

  showBoxNotifications() {
    $('#modalBoxNotifications').modal('show');
    this.loadNotifications();
  }

  showModalInitAddChannel() {
    $('#modalInitAddChannel').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.newChannel.next({});
  }

  changeActivity() {
    if (!this.activitiesUser.isSearching) {
      this.router.navigate(['/search?filter=all']);
      this.activitiesUser.isSearching = true;
      this.activitiesUser.location = this.LOCATION_SEARCH_ALL;
    }
  }

  backHome() {
    this.activitiesUser.isSearching = false;
    this.router.navigate(['/']);
    this.activitiesUser.location = this.LOCATION_HOME_CHAT;
  }

  logout() {
    const url = this.baseUrl + 'logout';
    this.http.get(url).subscribe(data => {
      document.location.href = this.baseUrl;
    });
  }

  showProfile() {
    $('#modalViewChatmeProfile').modal('show');
  }

  viewChatmeProfile() {

  }

}
