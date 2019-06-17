import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'modal-box-gallery',
  templateUrl: './modal-box-gallery.component.html',
  styleUrls: ['./modal-box-gallery.component.css']
})
export class ModalBoxGalleryComponent implements OnInit {


  bean = $bean;
  listFile: any = [];
  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {

  }

  ngOnInit() {
    for(let i = 0; i < 20; i++){
      this.listFile.push(i);
    }
  }
}
