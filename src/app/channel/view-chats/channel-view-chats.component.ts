import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {GlobalService} from "../../common/services/global.service";

declare var $bean;

@Component({
  selector: 'channel-view-chats',
  templateUrl: './channel-view-chats.component.html',
  styleUrls: ['./channel-view-chats.component.css']
})
export class ChannelViewChatsComponent implements OnInit {
  bean = $bean;
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  searchChats: any = [];
  myChats: any = [];
  countMyChannels: any = {};
  DEFAULT_NUMBER_CHAT = 10;
  DEFAULT_OFFSET_CHAT = 0;
  TYPE_CHAT_GROUP = 'CHAT_GROUP';
  TYPE_CHAT_CONTACT = 'CHAT_CONTACT';

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    // this.listChats(this.DEFAULT_NUMBER_CHAT, this.DEFAULT_OFFSET_CHAT);
    // // this.getCountMyChannels();
    // this.globalService.changeOrderListChats.subscribe(res => {
    //   if (res) {
    //     this.listChats(this.DEFAULT_NUMBER_CHAT, this.DEFAULT_OFFSET_CHAT);
    //   }
    // })

    this.globalService.myChats.subscribe(res => {
      this.myChats = res;
    })
    //
    // if ($bean.isEmpty(this.myChats)) {
    //   this.getAllChannels();
    // }

    this.globalService.changeOrderListChats.next(true);
  }

  getAllChannels() {
    let url = this.baseUrl + 'channels/listByUser';
    let form = {
      number: null,
      offset: null
    }
    this.http.post(url, form).subscribe(channels => {
      this.myChats = channels;
    })
  }

  getCountMyChannels() {
    let url = this.baseUrl + 'userChannels/countByNotRejected';
    let form = {};
    this.http.post(url, form).subscribe(data => {
      console.log('Count UserChannels ');
      console.log(data);
      this.countMyChannels = data;
    })
  }

  chooseChat(chat) {
    this.globalService.accessChat.next(chat);
  }

  // Danh sách channel người dùng có liên kết đến << Mặc định lấy 20 channel đầu tiên >>
  listChats(number, offset) {
    let url = this.baseUrl + 'channels/listByUser';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('List Channel: ');
        console.log(data);
        this.myChats = data;
      }
    })
  }

  getMoreChats(number, offset) {
    let url = this.baseUrl + 'channels/listByUser';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        let tempData: any = [];
        tempData = data;
        console.log('List Channel: ');
        console.log(data);
        for (let i = 0; i < tempData.length; i++) {
          this.myChats.push(tempData[i]);
        }
      }
    })
  }

  moreChat() {
    this.getMoreChats(this.DEFAULT_NUMBER_CHAT, this.myChats.length);
  }

  // Lấy tổng số chats để xem có hiển thị nút more
  getAllNumberOfChat() {

  }

}
