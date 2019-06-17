import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-chat',
  templateUrl: './modal-box-chat.component.html',
  styleUrls: ['./modal-box-chat.component.css']
})
export class ModalBoxChatComponent implements OnInit {

  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  userLogin: any = {};
  infoChat: any = {};
  cloneInfoChat: any = {};
  linkUserChannel: any = {};
  members: any = [];
  countMembers: number = 0;
  userCreatedChat: any = {};
  selectedUser: any = {};
  contentBoxConfirm: any = {};
  DELETE_CHAT = 'DELETE_CHAT';
  LEAVE_CHAT = 'LEAVE_CHAT';
  REMOVE_USER = 'REMOVE_USER';
  bean = $bean;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.infoChat.subscribe(res => {
      this.infoChat = res['infoChat'];
      this.cloneInfoChat = $bean.clone(this.infoChat);
      this.linkUserChannel = res['linkUserChannel'];
      this.members = this.infoChat['users'];
      if ($bean.isNotEmpty(this.members)) {
        this.countMembers = this.members.length;
      }
      if ($bean.isNotEmpty(this.infoChat) && $bean.isNotEmpty(this.infoChat['users'])) {
        this.getUserCreatedChat(this.infoChat['createdBy']);
      }
    })

    this.globalService.userLogin.subscribe(res => {
      this.userLogin = res;
    })
  }

  getUserCreatedChat(userId) {
    for (let i = 0; i < this.infoChat['users'].length; i++) {
      if (userId == this.infoChat['users'][i].id) {
        this.userCreatedChat = this.infoChat['users'][i];
      }
    }
  }

  removeUser(user) {
    let url = this.baseUrl + 'users/removeUser';
    let form = {
      userId: user.id,
      channelId: this.infoChat['id']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Remove user from chat success !');
        console.log(data);
        for (let i = 0; i < this.members.length; i++) {
          if (this.members[i].id = data['userId']) {
            this.members.splice(i, 1);
            break;
          }
        }
      }
    })
  }

  leaveChat() {
    $('#modalBoxChat').modal('hide');
    let url = this.baseUrl + 'users/leaveChannel';
    let form = {
      channelId: this.infoChat['id']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Leave chat success !');
        console.log(data);
        this.globalService.changeOrderListChats.next(true);
      }
    })
  }

  deleteChat() {
    $('#modalBoxChat').modal('hide');
    let url = this.baseUrl + 'users/deleteChannel';
    let form = {
      channelId: this.infoChat['id']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Delete chat success !');
        console.log(data);
      }
    })
  }

  addUserToChat() {
    $('#modalBoxChat').modal('hide');
    $('#modalDetailAddUserToChat').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.addUserToChat.next({channelId: this.infoChat['id']});
  }

  updateChat() {
    let url = this.baseUrl + 'channels/update';
    let updateChannel = {
      id: this.cloneInfoChat['id'],
      title: this.cloneInfoChat['title']
    }
    let form = {
      channel: updateChannel
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        $('#modalBoxChat').modal('hide');
        console.log('Update chat success !');
        console.log(data);
      }
    })
  }

  turnOnNotification() {
    let url = this.baseUrl + 'users/turnOnNotification';
    let form = {
      channelId: this.infoChat['id']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Delete chat success !');
        this.linkUserChannel = data;
        console.log(data);
        //  Listen lại channel
      }
    })
  }

  turnOffNotification() {
    let url = this.baseUrl + 'users/turnOffNotification';
    let form = {
      channelId: this.infoChat['id']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Delete chat success !');
        this.linkUserChannel = data;
        console.log(data);
        //  Listen lại channel
      }
    })
  }

  toggleNotification() {
    if (this.linkUserChannel['notification']) {
      this.turnOffNotification();
    } else {
      this.turnOnNotification();
    }
  }

  sendMessage() {
    $('#modalBoxChat').modal('hide');
    $('#inputSendMessage').focus();
  }

  acceptConfirm() {
    switch (this.contentBoxConfirm.action) {
      case this.DELETE_CHAT:
        this.deleteChat();
        break;
      case this.LEAVE_CHAT:
        this.leaveChat();
        break;
      case this.REMOVE_USER:
        this.removeUser(this.selectedUser);
        break;
      default:
        console.log('Finish confirm !');
    }
    $('#modalConfirmInChat').modal('hide');
  }

  confirmLeaveChat() {
    $('#modalConfirmInChat').modal('show');
    this.contentBoxConfirm = {};
    this.contentBoxConfirm = {
      title: 'Bạn muốn rời khỏi nhóm ?',
      action: this.LEAVE_CHAT
    }
  }

  confirmDeleteChat() {
    $('#modalConfirmInChat').modal('show');
    this.contentBoxConfirm = {};
    this.contentBoxConfirm = {
      title: 'Bạn muốn xóa nhóm chat ?',
      action: this.DELETE_CHAT
    }
  }

  confirmRemoveUser(user) {
    $('#modalConfirmInChat').modal('show');
    this.contentBoxConfirm = {};
    this.selectedUser = user;
    this.contentBoxConfirm = {
      title: 'Bạn muốn xóa ' + user.username + ' ra khỏi nhóm ?',
      action: this.REMOVE_USER
    }
  }
}
