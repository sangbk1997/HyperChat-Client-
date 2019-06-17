import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component, HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

declare var $bean;
declare var $;

@Component({
  selector: 'box-users-read-messenger',
  templateUrl: './box-users-read-messenger.component.html',
  styleUrls: ['./box-users-read-messenger.component.css']
})
export class BoxUsersReadMessengerComponent implements OnInit, OnChanges {

  @Input() readUsers: any;
  @Input() triggerElementId: any;
  CLASS_BOX_USERS_READ_MESSENGER = 'box-users-read-messenger';
  styleBoxUsersReadMessenger = {
    top: -1000,
    left: -1000
  }


  constructor(private cdRef: ChangeDetectorRef) {
  }

  @HostListener('document:click', ['$event'])
  checkClick(event) {
    if (event.target.classList.contains(this.CLASS_BOX_USERS_READ_MESSENGER) || $(event.target).parents("." + this.CLASS_BOX_USERS_READ_MESSENGER).length) {
    } else {
      this.hideBox();
    }
  }

  ngOnInit() {
    if ($bean.isNil(this.readUsers)) {
      this.readUsers = [];
    }
    if ($bean.isNil(this.triggerElementId)) {
      this.triggerElementId = '';
    }
    this.checkShowBox();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkShowBox();
  }

  checkShowBox() {
    if (($bean.isNotEmpty(this.readUsers)) && ($bean.isNotEmpty(this.triggerElementId))) {
      this.setUpPosition();
    } else {
      this.hideBox();
    }
  }

  setUpPosition() {
    this.cdRef.detectChanges();
    let triggerElement = $("#" + this.triggerElementId);
    let triggerTop = triggerElement.offset().top;
    let triggerLeft = triggerElement.offset().left;
    let outerWidthTrigger = triggerElement.outerWidth();
    let outerHeightTrigger = triggerElement.outerHeight();
    let boxUsersReadMessenger = $('.' + this.CLASS_BOX_USERS_READ_MESSENGER);
    let outerWidthBoxUsersReadMessenger = boxUsersReadMessenger.outerWidth();
    let outerHeightBoxUsersReadMessenger = boxUsersReadMessenger.outerHeight();
    let boxUsersReadMessengerTop = triggerTop - 10 - outerHeightBoxUsersReadMessenger;
    let boxUsersReadMessengerLeft = triggerLeft + outerWidthTrigger / 2 - outerWidthBoxUsersReadMessenger;
    this.styleBoxUsersReadMessenger.top = boxUsersReadMessengerTop;
    this.styleBoxUsersReadMessenger.left = boxUsersReadMessengerLeft;
    console.log(this.styleBoxUsersReadMessenger);
  }

  hideBox() {
    this.styleBoxUsersReadMessenger.top = -1000;
    this.styleBoxUsersReadMessenger.left = -1000;
  }


  detailUser(userId) {
    this.hideBox();
  }

}
