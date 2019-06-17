import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-confirm-request',
  templateUrl: './modal-box-confirm-request.component.html',
  styleUrls: ['./modal-box-confirm-request.component.css']
})
export class ModalBoxConfirmRequestComponent implements OnInit {
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  selectedRequest: any = {};
  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {

  }

  ngOnInit() {
    this.globalService.selectedRequest.subscribe(res => {
      this.selectedRequest = res;
    })
  }


  acceptRequest() {
    $('#modalConfirmRequest').modal('hide');
    let url = this.baseUrl + 'users/acceptRequest';
    let form = {
      requestId: this.selectedRequest.id
    }
    this.http.post(url, form).subscribe(data => {
      alert('Yêu cầu đã được chấp nhận !');
    }, err => {
      alert('Đã có lỗi xảy ra khi chấp nhận yêu cầu !');
    })
  }

  // discardRequest() {
  //   $('#modalConfirmRequest').modal('hide');
  //   let url = this.baseUrl + 'user/discardRequest';
  //   let form = {
  //     requestId: this.selectedRequest.id
  //   }
  //   this.http.post(url, form).subscribe(data => {
  //     alert('Bạn vừa từ chối yêu cầu !');
  //   }, err => {
  //     alert('Đã có lỗi xảy ra khi từ chối yêu cầu !');
  //   })
  // }

  rejectRequest() {
    $('#modalConfirmRequest').modal('hide');
    let url = this.baseUrl + 'users/rejectRequest';
    let form = {
      requestId: this.selectedRequest.id
    }
    this.http.post(url, form).subscribe(data => {
      alert('Bạn vừa xóa yêu cầu !');
    }, err => {
      alert('Đã có lỗi xảy ra khi xóa yêu cầu !');
    })
  }
}
