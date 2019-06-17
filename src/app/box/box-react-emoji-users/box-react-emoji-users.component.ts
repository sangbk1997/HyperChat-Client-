import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
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
  selector: 'box-react-emoji-users',
  templateUrl: './box-react-emoji-users.component.html',
  styleUrls: ['./box-react-emoji-users.component.css']
})
export class BoxReactEmojiUsersComponent implements OnInit, OnChanges {

  @Input() emoji: any;
  @Input() users: any;
  @Input() triggerElementId: any;
  CLASS_BOX_REACT_EMOJI_USERS = 'box-react-emoji-users';
  styleBoxReactEmojiUsers = {
    top: -1000,
    left: -1000
  }


  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if ($bean.isNil(this.emoji)) {
      this.emoji = '';
    }
    if ($bean.isNil(this.users)) {
      this.users = [];
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
    if (($bean.isNotEmpty(this.emoji)) && ($bean.isNotEmpty(this.users)) && ($bean.isNotEmpty(this.triggerElementId))) {
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
    let boxReactEmojiUsers = $('.' + this.CLASS_BOX_REACT_EMOJI_USERS);
    let outerWidthBoxReactEmojiUsers = boxReactEmojiUsers.outerWidth();
    let outerHeightBoxReactEmojiUsers = boxReactEmojiUsers.outerHeight();
    let boxReactEmojiUsersTop = triggerTop - 5 - outerHeightBoxReactEmojiUsers;
    let boxReactEmojiUsersLeft = triggerLeft + outerWidthTrigger / 2 - outerWidthBoxReactEmojiUsers / 2;
    this.styleBoxReactEmojiUsers.top = boxReactEmojiUsersTop;
    this.styleBoxReactEmojiUsers.left = boxReactEmojiUsersLeft;
    console.log(this.styleBoxReactEmojiUsers);
    event.stopPropagation();
  }

  hideBox() {
    this.styleBoxReactEmojiUsers.top = -1000;
    this.styleBoxReactEmojiUsers.left = -1000;
  }

}
