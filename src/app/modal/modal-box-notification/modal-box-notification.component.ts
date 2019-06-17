import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-notification',
  templateUrl: './modal-box-notification.component.html',
  styleUrls: ['./modal-box-notification.component.css']
})
export class ModalBoxNotificationComponent implements OnInit {

  listIncomeRequest: any = [];
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  bean = $bean;
  selectedRequest: any;
  isConfirm = false;
  selectedNotification: any;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    // this.globalService.notifications.subscribe(res => {
    //   if ($bean.isNotEmpty(res)) {
    //     this.listRequest = res['listRequest'];
    //     this.listInform = res['listInform'];
    //   }
    // })
    this.globalService.listIncomeRequest.subscribe(res => {
      if ($bean.isNotEmpty(res)) {
        this.listIncomeRequest = res;
      }
    })
  }

  chooseRequest(request) {
    this.selectedRequest = request;
    this.globalService.selectedRequest.next(this.selectedRequest);
    this.isConfirm = false;
    $('#modalBoxNotifications').modal('hide');
    $('#modalConfirmRequest').modal('show');
  }

  // closeConfirmBox() {
  //
  //   if (this.isConfirm) {
  //     let index = this.listRequest.indexOf(this.selectedRequest);
  //     if (index != -1) {
  //       this.listRequest.splice(index, 1);
  //     }
  //   }
  // }

  goToDetailInform(inform) {
    //   Đi tới vị trí của tin nhắn trong nhóm chat
  }
}
