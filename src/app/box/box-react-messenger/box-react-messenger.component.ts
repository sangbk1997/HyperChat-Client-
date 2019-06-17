import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GlobalService} from "../../common/services/global.service";

declare var $bean;
declare var $;

@Component({
  selector: 'box-react-messenger',
  templateUrl: './box-react-messenger.component.html',
  styleUrls: ['./box-react-messenger.component.css']
})
export class BoxReactMessengerComponent implements OnInit, OnChanges {

  @Input() reactEmojis: any;
  @Input() isViewUsersRead: boolean;
  ACTION_UNREAD = 'UNREAD';
  ACTION_READED = 'READED';
  ACTION_REACTED = 'REACTED';
  LENGTH_SHOW_USER_SAMPLE = 3;
  isShowBoxReactEmojis: boolean = false;
  objEmojis: any = {};
  listEmojis: any = [];
  listUserRead: any = [];
  listUserReadSample: any = [];
  randomeId = $bean.genRandomID(16);

  constructor(private globalService: GlobalService, private cdRef: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setUpBox();
  }

  ngOnInit() {
    // this.setUpBox();
    if ($bean.isNil(this.reactEmojis)) {
      this.reactEmojis = [];
    }
    if ($bean.isNil(this.isViewUsersRead)) {
      // this.isViewUsersRead = true;
      this.isViewUsersRead = false;
    }
  }

  resetData() {
    this.isShowBoxReactEmojis = false;
    this.listEmojis = [];
    this.objEmojis = {};
  }

  setUpBox() {
    // this.cdRef.detectChanges();
    this.resetData();
    if ($bean.isNil(this.reactEmojis)) {
      this.reactEmojis = [];
    }
    for (let i = 0; i < this.reactEmojis.length; i++) {
      if ((this.reactEmojis[i].action == this.ACTION_REACTED)) {
        if ((this.reactEmojis[i].emoji in this.objEmojis)) {
          this.objEmojis[this.reactEmojis[i].emoji].push(this.reactEmojis[i].user);
        } else {
          this.objEmojis[this.reactEmojis[i].emoji] = [this.reactEmojis[i].user];
        }
      } else {
        if (this.reactEmojis[i].action = this.ACTION_UNREAD) {
          let objUser = this.reactEmojis[i].user;
          objUser['readDate'] = this.reactEmojis[i].readDate;
          this.listUserRead.push(objUser);
        }
      }
    }
    for (let key in this.objEmojis) {
      this.listEmojis.push(key);
    }
    if ($bean.isNotEmpty(this.listUserRead)) {
      let lengthSampleUser = this.LENGTH_SHOW_USER_SAMPLE;
      if (this.listUserRead.length < this.LENGTH_SHOW_USER_SAMPLE) {
        lengthSampleUser = this.listUserRead.length;
      }
      for (let i = 0; i < lengthSampleUser; i++) {
        this.listUserReadSample.push(this.listUserRead[i]);
      }
    }
    if ($bean.isNotEmpty(this.listEmojis)) {
      this.isShowBoxReactEmojis = true;
    } else {
      this.isShowBoxReactEmojis = false;
    }
  }

  showReactUsers(emoji, triggerElementId) {
    this.globalService.dataShowReactEmoji.next({
      selectedEmoji: emoji,
      users: this.objEmojis[emoji],
      triggerElementId: triggerElementId
    })
  }

  showBoxUsersRead(event, triggerElementId) {
    let cloneListUserRead = $bean.clone(this.listUserRead);
    this.globalService.dataShowUsersReadMessenger.next({
      readUsers: cloneListUserRead,
      triggerElementId: triggerElementId
    })
    event.stopPropagation();
  }

  hideReactUsers(emoji) {
    this.globalService.dataShowReactEmoji.next(null);
  }
}
