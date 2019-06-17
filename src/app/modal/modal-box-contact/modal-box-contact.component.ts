import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-contact',
  templateUrl: './modal-box-contact.component.html',
  styleUrls: ['./modal-box-contact.component.css']
})
export class ModalBoxContactComponent implements OnInit {

  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  infoContact: any = {};
  contentBoxConfirm: any = {};
  linkUserChannel: any = {};
  ACTION_BLOCK_USER = 'ACTION_BLOCK_USER';
  ACTION_DELETE_CHAT = 'ACTION_DELETE_CHAT';
  bean = $bean;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.infoContact.subscribe(res => {
      this.infoContact = res['infoContact'];
      this.linkUserChannel = res['linkUserChannel'];
    })
  }

  blockContact(userId) {
    $('#modalBoxContact').modal('hide');
    let url = this.baseUrl + 'users/blockContact';
    let form = {
      userId: userId
    }
    // this.http.post(url, form).subscribe(data => {
    //   if ($bean.isNotEmpty(data)) {
    //     console.log('Remove user from chat success !');
    //     console.log(data);
    //   }
    // })
  }

  deleteChat() {
    $('#modalBoxContact').modal('hide');
    let url = this.baseUrl + 'users/deleteChannel';
    let form = {
      channelId: this.linkUserChannel['channelId']
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Delete chat success !');
        this.globalService.changeOrderListChats.next(true);
        console.log(data);
      }
    })
  }

  addNewGroup() {
    $('#modalBoxContact').modal('hide');
    $('#modalInitAddChannel').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.newChannel.next({members: [this.infoContact['id']]});
  }

  sendMessage() {
    $('#modalBoxContact').modal('hide');
    $('#inputSendMessage').focus();
  }

  acceptConfirm() {
    switch (this.contentBoxConfirm.action) {
      case this.ACTION_DELETE_CHAT:
        this.deleteChat();
        break;
      case this.ACTION_BLOCK_USER:
        this.blockContact(this.infoContact['id']);
        break;
      default:
        console.log('Finish confirm !');
    }
    $('#modalConfirmInContact').modal('hide');
  }

  confirmBlockUser() {
    $('#modalConfirmInContact').modal('show');
    this.contentBoxConfirm = {};
    this.contentBoxConfirm = {
      title: 'Bạn muốn chặn ' + this.infoContact.username,
      action: this.ACTION_BLOCK_USER
    }
  }

  confirmDeleteChat() {
    $('#modalConfirmInContact').modal('show');
    this.contentBoxConfirm = {};
    this.contentBoxConfirm = {
      title: 'Bạn muốn xóa cuộc trò chuyện ?',
      action: this.ACTION_DELETE_CHAT
    }
  }

}
