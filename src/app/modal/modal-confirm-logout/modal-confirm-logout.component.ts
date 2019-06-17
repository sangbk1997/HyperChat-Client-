import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-confirm-logout',
  templateUrl: './modal-confirm-logout.component.html',
  styleUrls: ['./modal-confirm-logout.component.css']
})
export class ModalConfirmLogoutComponent implements OnInit {

  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
  }

  logout(){
    let url = this.baseUrl + 'logout';
    this.http.get(url).subscribe(res => {
      location.href = this.baseUrl;
    })
  }

}
