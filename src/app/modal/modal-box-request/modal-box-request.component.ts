import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-request',
  templateUrl: './modal-box-request.component.html',
  styleUrls: ['./modal-box-request.component.css']
})
export class ModalBoxRequestComponent implements OnInit {

  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  TYPE_INCOME_REQUEST = 'INCOME_REQUEST';
  TYPE_SENT_REQUEST = 'SENT_REQUEST';
  title: string = '';
  typeRequest: any = [];
  listRequest: any = [];
  selectedRequest: any = {};
  bean = $bean;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.listIncomeRequest.subscribe(res => {
      this.listRequest = [];
      this.listRequest = res;
      this.typeRequest = this.TYPE_INCOME_REQUEST;
      this.title = 'Danh sách yêu cầu kết nối';
    })

    this.globalService.listSentRequest.subscribe(res => {
      this.listRequest = [];
      this.listRequest = res;
      this.typeRequest = this.TYPE_SENT_REQUEST;
      this.title = 'Danh sách kết nối đã gửi';
    })
  }

  acceptRequest(request) {
    this.selectedRequest = request;
    if ($bean.isNotEmpty(this.selectedRequest)) {
      let url = this.baseUrl + 'users/acceptRequest';
      let form = {
        requestId: this.selectedRequest['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Accept chat');
        console.log(data);
        this.selectedRequest = data;
        this.removeSelectedRequest();
      })
    }
  }

  rejectRequest(request) {
    this.selectedRequest = request;
    if ($bean.isNotEmpty(this.selectedRequest)) {
      let url = this.baseUrl + 'users/rejectRequest';
      let form = {
        requestId: this.selectedRequest['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Reject Chat');
        console.log(data);
        this.selectedRequest = data;
        this.removeSelectedRequest();
      })
    }
  }

  deleteRequest(request) {
    this.selectedRequest = request;
    if ($bean.isNotEmpty(this.selectedRequest)) {
      let url = this.baseUrl + 'users/deleteRequest';
      let form = {
        requestId: this.selectedRequest['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Delete chat');
        console.log(data);
        this.removeSelectedRequest();
      })
    }
  }

  removeSelectedRequest() {
    for (let i = 0; i < this.listRequest.length; i++) {
      if (this.listRequest[i].id == this.selectedRequest.id) {
        this.listRequest.splice(i, 1);
        break;
      }
    }
  }

}
