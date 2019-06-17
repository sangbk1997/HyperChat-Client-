import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-info-summary',
  templateUrl: './modal-info-summary.component.html',
  styleUrls: ['./modal-info-summary.compoent.css']
})
export class ModalInfoSummaryComponent implements OnInit {

  userLogin: any = {};
  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  ngOnInit() {
    this.globalService.userLogin.subscribe(res => {
      this.userLogin = res;
    })
  }

  showProfile(){

  }

}
