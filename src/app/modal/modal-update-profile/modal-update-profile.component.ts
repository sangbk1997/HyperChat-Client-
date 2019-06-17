import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-update-profile',
  templateUrl: './modal-update-profile.component.html',
  styleUrls: ['./modal-update-profile.component.css']
})
export class ModalUpdateProfileComponent implements OnInit {

  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  userLogin: any = {};
  userLoginClone: any = {};
  bean = $bean;
  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {

  }

  ngOnInit() {
    this.globalService.userLogin.subscribe(data => {
      this.userLogin = data;
    })
  }

  updateProfile(){
    let url = this.baseUrl + 'user/updateProfile';
    let form = this.userLoginClone;
    this.http.post(url, form).subscribe(data => {
      console.log('Update Profile success !');
      console.log(data);
      this.userLogin = data;
      this.globalService.userLogin.next(data);
    })
  }
}
