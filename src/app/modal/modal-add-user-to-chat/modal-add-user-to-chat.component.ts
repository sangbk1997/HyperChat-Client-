import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-add-user-to-chat',
  templateUrl: './modal-add-user-to-chat.component.html',
  styleUrls: ['./modal-add-user-to-chat.component.css']
})
export class ModalAddUserToChatComponent implements OnInit {
  DEFAULT_NUMBER_SUGESST = 20;
  DEFAULT_NUMBER_OFFSET = 0;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  channelId: any = '';
  bean = $bean;
  listUserSelected: any = [];
  suggestPeople: any = [];

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.addUserToChat.subscribe(res => {
      if ($bean.isNotEmpty(res)) {
        this.channelId = res['channelId'];
        this.listUserSuggest();
      }
    })
  }

  listUserSuggest() {
    let url = this.baseUrl + 'users/suggestedByChannel';
    // let url = this.baseUrl + 'users';
    let form = {
      channelId: this.channelId,
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
  addUser() {
    $('#modalDetailAddUserToChat').modal('hide');
    const url = this.baseUrl + 'users/addUsersToChat';
    if ($bean.isNotEmpty(this.listUserSelected)) {
      let userIds = [];
      for (let i = 0; i < this.listUserSelected.length; i++) {
        userIds.push(this.listUserSelected[i].id);
      }
      const form = {
        channelId: this.channelId,
        userIds: userIds
      };
      this.http.post(url, form).subscribe(data => {
        console.log('Add user to chat success ');
        console.log(data);
      });
    }
  }

  showmodalDetailAddUserToChat() {
    $('#modalInitAddChannel').modal('hide');
    $('#modalDetailAddUserToChat').modal('show');
    this.listUserSelected = [];
  }
}
