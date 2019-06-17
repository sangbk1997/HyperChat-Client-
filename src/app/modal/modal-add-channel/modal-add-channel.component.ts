import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-add-channel',
  templateUrl: './modal-add-channel.component.html',
  styleUrls: ['./modal-add-channel.component.css']
})
export class ModalAddChannelComponent implements OnInit {
  DEFAULT_NUMBER_SUGESST = 20;
  DEFAULT_NUMBER_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  bean = $bean;
  listUserSelected: any = [];
  myContacts: any = [];
  suggestPeople: any = [];
  newChannel: any = {};

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.newChannel.subscribe(res => {
      this.newChannel = res;
      this.listUserSelected = [];
      if ($bean.isNotEmpty(res['members'])) {
        this.getListUsersDefault(res['members']);
      }
      this.listUserSuggest();
      this.listContacts();
    })
  }

  getListUsersDefault(userIds) {
    if ($bean.isNotEmpty(userIds)) {
      for (let i = 0; i < userIds.length; i++) {
        let url = this.baseUrl + 'users/' + userIds[i];
        this.http.get(url).subscribe(user => {
          if ($bean.isNotEmpty(user)) {
            this.listUserSelected.push(user);
          }
        })
      }
    }
  }

  listMyContact() {
    let url = this.baseUrl + 'users/listMyContacts';
    // let url = this.baseUrl + 'users';
    let form = {
      number: this.DEFAULT_NUMBER_SUGESST,
      offset: this.DEFAULT_NUMBER_OFFSET
    }
    this.http.post(url, form).subscribe(data => {
      this.myContacts = data;
    })
  }

  listUserSuggest() {
    let url = this.baseUrl + 'users/suggested';
    // let url = this.baseUrl + 'users';
    let form = {
      number: this.DEFAULT_NUMBER_SUGESST,
      offset: this.DEFAULT_NUMBER_OFFSET
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.suggestPeople = data;
      }
    })
  }

  // Thêm người hoặc xóa người khi mới thêm kênh
  toggleUser(user) {
    if ($bean.isNotEmpty(this.listUserSelected)) {
      const index = this.listUserSelected.indexOf(user);
      if (index !== -1) {
        this.listUserSelected.splice(index, 1);
      } else {
        this.listUserSelected.push(user);
      }
    } else {
      this.listUserSelected.push(user);
    }
  }

  checkUserSelected(user) {
    let result = false;
    for (let i = 0; i < this.listUserSelected.length; i++) {
      if (user.id == this.listUserSelected[i]) {
        result = true;
        return result;
      }
    }
    return result;
  }

  // Tạo kênh
  addChannel() {
    $('#modalDetailAddChannel').modal('hide');
    this.newChannel['members'] = [];
    if ($bean.isNotEmpty(this.listUserSelected)) {
      for (let i = 0; i < this.listUserSelected.length; i++) {
        this.newChannel['members'].push(this.listUserSelected[i].id);
      }
    }
    const url = this.baseUrl + 'channels/addChat';
    const form = {
      title: this.newChannel.title,
      members: this.newChannel['members']
    };
    this.http.post(url, form).subscribe(data => {
      console.log('Add channel success ');
      console.log(data);
      // back home
      this.globalService.changeOrderListChats.next(true);
    });
  }

  showModalDetailAddChannel() {
    $('#modalInitAddChannel').modal('hide');
    $('#modalDetailAddChannel').modal('show');
  }


  listContacts() {
    const url = this.baseUrl + 'users/suggested';
    let form = {
      number: this.DEFAULT_NUMBER_SUGESST,
      offset: this.DEFAULT_NUMBER_OFFSET
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        this.myContacts = data;
      }
    });
  }
}
