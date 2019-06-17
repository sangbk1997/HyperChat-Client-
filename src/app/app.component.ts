import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {GlobalService} from "./common/services/global.service";
import {FileUploader} from 'ng2-file-upload';
import {__values} from "tslib";
import {EmojiEvent, emojis} from "@ctrl/ngx-emoji-mart/ngx-emoji";

declare var PushStream;
declare var $bean;
declare var $;

@Component({
  selector: 'chatme-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  PUSH_STREAM_SERVER = '172.20.30.107';
  ENTER_KEY_CODE = 13;
  DEFAULT_NUMBER_REQUEST = 10;
  DEFAULT_NUMBER_MESSAGE = 20;
  DEFAULT_NUMBER_USER = 20;
  DEFAULT_NUMBER_CHANNEL = 20;
  DEFAULT_NUMBER_OFSET = 0;
  PREFIX_MARK_ELEMENT = 'mark-positon-';
  ROLE_IS_USER = 'USER';
  ROLE_IS_CHANNEL = 'CHANNEL';
  ROLE_IS_MESSENGER = 'MESSENGER';
  CONNECTION_STATUS_NOT_CONNECT = 'NOT_CONNECTED';
  CONNECTION_STATUS_PENDING = 'PENDING';
  CONNECTION_STATUS_CONNECTED = 'CONNECTED';
  IS_ADMIN = true;
  IS_NOT_ADMIN = false;
  STATUS_SUBCRIBE = true;
  STATUS_UNSUBCRIBE = false;
  STATUS_PENDING = 'PENDING';
  STATUS_ACCEPTED = 'ACCEPTED';
  STATUS_DISCARDED = 'DISCARDED';
  STATUS_REJECTED = 'REJECTED';
  STATUS_DISABLED = 'DISABLED';
  STATUS_DELETED = 'DELETED';
  ACTION_UNREAD = 'UNREAD';
  ACTION_READED = 'READED';
  STATUS_ORIGINAL = 'ORIGINAL';
  STATUS_EDITED = 'EDITED';
  TYPE_REQUEST_USER_CHAT = 'REQUEST_CHAT_GROUP';
  TYPE_REQUEST_CHAT_USER = 'REQUEST_CHAT_USER';
  TYPE_CHAT_GROUP = 'CHAT_GROUP';
  TYPE_CHAT_CONTACT = 'CHAT_CONTACT';
  TYPE_ROLE_PRIMARY = 'PRIMARY';
  TYPE_ROLE_ATTACHED = 'ATTACHED';
  TYPE_ROLE_NOTIFIED = 'NOTIFIED';
  TYPE_NEW_MESSENGER = 'NEW_MESSENGER';
  TYPE_UPDATED_MESSENGER = 'UPDATED_MESSENGER';
  TYPE_DELETED_MESSENGER = 'DELETED_MESSENGER';
  TYPE_NEW_REACT = 'NEW_REACT';
  TYPE_UPDATED_REACT = 'UPDATED_REACT';
  TYPE_DELETED_REACT = 'DELETED_REACT';
  TYPE_NEW_USER_CHANNEL = 'NEW_USER_CHANNEL';
  TYPE_MESSENGER_TEXT = 'TEXT';
  TYPE_MESSENGER_IMAGE = 'IMAGE';
  TYPE_MESSENGER_LINK = 'LINK';
  TYPE_MESSENGER_FILE = 'FILE';
  STATUS_NOTIFICATION = true;
  STATUS_NOT_NOTIFICATION = false;
  ZERO_POSITION = 0;
  STATUS_INACTIVE = false;
  STATUS_ACTIVE = true;
  CLASS_BOX_MESSAGE_EMOJIS = 'emoji-mart';
  CLASS_BOX_REACT_EMOJIS = 'box-emojis-react-message';
  CLASS_BOX_MESSAGE_ACTIVITIES = 'box-message-activities';
  title = 'ChatMe';
  inputValue = '';
  userLogin: any = {};
  // baseUrl = "https://chat.hyper.com:9999/";
  baseUrl = "http://chat.hyper.com:9000/";
  bean = $bean;
  dataFromPushstream: any;
  settingOption = {
    host: this.PUSH_STREAM_SERVER,
    modes: 'websocket',
    port: 80,
    // useSSL: true,
    channelsByArgument: true,
    channelsArgument: 'channels'
  };
  pushStreamClient: any;
  currentMarkPosition = '';
  firstAccess = true; // trang thai khi nguoi dung moi truy cap
  selectedChat: any = {};
  infoChannel: any = {};
  requestChat: any = {};
  listMessages: any = [];
  moreMessage: any = [];
  allChannels: any = [];
  // statusRequest: any;
  // Thông tin kết nối mặc định
  connectionStatus = {
    status: undefined,
    typeRequest: undefined,
    isCheck: false
  };
  listRequestByChannel: any = [];
  listSentRequest: any = [];
  listIncomeRequest: any = [];
  countMembers: number = 0;
  processUpload: boolean = false;
  processUpdateMessenger: boolean = false;
  uploadFiles: any = [];
  uploadedFiles: any = [];
  styleBoxMessageEmojis = {
    top: -1000,
    left: -1000
  };
  styleBoxReactEmojis = {
    top: -1000,
    left: -1000
  };
  styleBoxMessageActivities = {
    top: -1000,
    left: -1000
  };
  listEmojis: any = [];
  selectedMessenger: any = {};
  selectedMessageElementId: any = '';
  processCopyMessenger: boolean = false;
  setUpActivitiesObj = {
    edit: false,
    copy: false,
    download: false,
    react: false,
    forward: false,
    remove: false
  };
  dataShowReactEmoji: any = {};
  dataShowUsersReadMessenger: any = {};
  // focusUpload: boolean = false;
  // URL_UPLOAD_FILE = this.baseUrl + '/upload';
  // uploader: FileUploader = new FileUploader({url: this.URL_UPLOAD_FILE});
  // hasBaseDropZoneOver: boolean = false;
  // hasAnotherDropZoneOver: boolean = false;

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {
  }

  @HostListener('document:click', ['$event'])
  checkClick(event) {
    if (event.target.classList.contains(this.CLASS_BOX_MESSAGE_EMOJIS) || $(event.target).parents("." + this.CLASS_BOX_MESSAGE_EMOJIS).length) {
    } else {
      this.hideBoxMessageEmojis();
    }

    this.hideBoxReactEmojis();

    this.hideBoxMessageActivities();
  }

  ngOnInit() {
    this.pushStreamClient = new PushStream(this.settingOption);
    this.getUserLogin();
    this.globalService.accessChat.subscribe(res => {
      console.log('this is the current value', res);
      this.firstAccess = false;
      this.selectedChat = res;
      this.listMessages = [];
      if (res['role'] == this.ROLE_IS_CHANNEL) {
        if (this.selectedChat['type'] == this.TYPE_CHAT_CONTACT) {
          this.selectedChat = res['users'][0];
        }
      }
      this.goCheckLinkChat();
    });

    this.globalService.dataShowReactEmoji.subscribe(res => {
      if ($bean.isNotEmpty(res)) {
        this.dataShowReactEmoji = res;
      } else {
        this.dataShowReactEmoji = {};
      }
    });

    this.globalService.dataShowUsersReadMessenger.subscribe(res => {
      if ($bean.isNotEmpty(res)) {
        this.dataShowUsersReadMessenger = res;
      } else {
        this.dataShowUsersReadMessenger = {};
      }
    });

    this.getEmojisDefault();

    this.globalService.changeOrderListChats.subscribe(res => {
      if (res) {
        this.getAllChannels();
      }
    })
  }


  goCheckLinkChat() {
    if (this.selectedChat['role'] == this.ROLE_IS_CHANNEL) {
      this.getInfoToChannel(this.selectedChat['id']);
      this.getInfoChannel(this.selectedChat['id']);
    } else {
      this.getInfoToContact(this.selectedChat['id']);
    }
  }

  getAllChannels() {
    let url = this.baseUrl + 'channels/listByUser';
    let form = {
      number: null,
      offset: null
    }
    this.http.post(url, form).subscribe(channels => {
      console.log('All Channel');
      console.log(channels);
      this.allChannels = channels;
      this.globalService.myChats.next(this.allChannels);
      this.pushStreamClient.disconnect();
      this.pushStreamClient.removeAllChannels();
      if ($bean.isNotEmpty(this.allChannels)) {
        for (let i = 0; i < this.allChannels.length; i++) {
          this.listenChannel(this.allChannels[i]['id']);
        }
      }
    })
  }

  getUserLogin() {
    let url = this.baseUrl + 'userLogin';
    this.http.get(url).subscribe(data => {
      this.userLogin = data;
      this.globalService.userLogin.next(this.userLogin);
    })
  }

  getInfoToChannel(channelId) {
    // kiểm tra liên kết user - channel
    let url = this.baseUrl + 'users/checkLinkToChannel';
    let inputChannel = {
      channelId: channelId
    }
    this.http.post(url, inputChannel).subscribe(userChannel => {
      if ($bean.isNotEmpty(userChannel)) {
        //  Đã có liên kết
        //  Nếu chưa được chấp nhận thì hiển thị request đang chờ
        //  Nếu đã là thành viên thì request lấy dữ liệu
        this.requestChat = userChannel;
        console.log('RequestChat');
        console.log(this.requestChat);
        if (userChannel['status'] == this.STATUS_ACCEPTED) {
          this.setConnectionStatus({
            status: this.CONNECTION_STATUS_CONNECTED,
            isCheck: true
          })
          this.loadMessageByChannel(channelId, this.DEFAULT_NUMBER_MESSAGE, userChannel['position']);
        } else {
          this.setConnectionStatus({
            status: this.CONNECTION_STATUS_PENDING,
            isCheck: true
          });
        }
      } else {
        //  Nếu không là thành viên hiển thị box request to chat
        this.setConnectionStatus({
          status: this.CONNECTION_STATUS_NOT_CONNECT,
          isCheck: true
        });
      }
    })
  }

  getInfoToContact(contactId) {
    //  Nếu đã có contact thì chuyển load messenger
    let url = this.baseUrl + "users/checkLinkToContact";
    let form = {
      contactId: contactId
    }
    this.http.post(url, form).subscribe(userChannel => {
      if ($bean.isNotEmpty(userChannel)) {
        console.log('Link user - channel !');
        console.log(userChannel);
        console.log('UserLogin');
        console.log(this.userLogin);
        this.requestChat = userChannel;
        // //  Get lấy link contact - channel để kiểm tra kết quả
        // let url = this.baseUrl + 'users/checkLinkUserChannel';
        // let inputChannel = {
        //   userId: contactId,
        //   channelId: userChannel['channelId']
        // }
        // this.http.post(url, form).subscribe(contactChannel => {
        //   this.setConnectionStatus({
        //     status: userChannel['status'],
        //     isCheck: true
        //   });
        //   if (contactChannel['status'] == this.STATUS_ACCEPT) {
        //     this.loadMessageByChannel(userChannel['channelId'], this.DEFAULT_NUMBER_MESSAGE, userChannel['position']);
        //   }
        // })

        //  Lấy thông tin xem channel đã được active hay chưa 
        let url = this.baseUrl + 'channels/' + userChannel['channelId'];
        this.http.get(url).subscribe(channel => {
          if (channel['status'] == this.STATUS_ACTIVE) {
            this.setConnectionStatus({
              status: this.CONNECTION_STATUS_CONNECTED,
              isCheck: true
            })
            this.loadMessageByChannel(userChannel['channelId'], this.DEFAULT_NUMBER_MESSAGE, userChannel['position']);
          } else {
            this.setConnectionStatus({
              status: this.CONNECTION_STATUS_PENDING,
              isCheck: true
            })
          }
        })
      } else {
        this.setConnectionStatus({
          status: this.CONNECTION_STATUS_NOT_CONNECT,
          isCheck: true
        });
      }
    })
  }

  loadMessageByChannel(channelId, number, offset) {
    let url = this.baseUrl + 'messengers/byChannel';
    let form = {
      channelId: channelId,
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      if ($bean.isNotEmpty(data)) {
        console.log('Messenger By channel');
        console.log(data);
        let moreMessage: any = [];
        moreMessage = data;
        for (let i = (moreMessage.length - 1); i >= 0; i--) {
          this.listMessages.push(moreMessage[i]);
        }
      }
    })
  }

  setConnectionStatus(obj) {
    if ($bean.isNotEmpty(obj)) {
      for (let key in obj) {
        if (key in this.connectionStatus) {
          this.connectionStatus[key] = obj[key];
        }
      }
    }
  }


  getListRequestByChannel(channelId) {
    let url = this.baseUrl + 'user/listRequestChannel';
    let form = {
      channelId: channelId
    }
    this.http.post(url, form).subscribe(data => {
      this.listRequestByChannel = data;
      console.log('List Request !');
      console.log(data);
    })
  }

  getListSentRequest(number, offset) {
    let url = this.baseUrl + 'users/listSentRequest';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      this.listSentRequest = data;
      console.log('List Request !');
      console.log(data);
    })
  }

  getListIncomeRequest(number, offset) {
    let url = this.baseUrl + 'users/listIncomeRequest';
    let form = {
      number: number,
      offset: offset
    }
    this.http.post(url, form).subscribe(data => {
      this.listIncomeRequest = data;
      console.log('List Request !');
      console.log(data);
    })
  }

  sendRequest() {
    if (this.selectedChat['role'] == this.ROLE_IS_CHANNEL) {
      this.requestToChat();
    } else {
      this.addContact();
    }
  }

  requestToChat() {
    let url = this.baseUrl + 'users/requestToChat';
    let form = {
      channelId: this.selectedChat.id
    }
    this.http.post(url, form).subscribe(data => {
      console.log('Success request Chat !');
      console.log(data);
      this.requestChat = data;
      this.getInfoToChannel(this.requestChat['channelId']);
    })
  }

  addContact() {
    let url = this.baseUrl + 'channels/addContact';
    let form = {
      members: [this.selectedChat.id]
    };
    this.http.post(url, form).subscribe(data => {
      console.log('Success request to Contact !');
      console.log(data);
      // Thay đổi danh sách kênh kết nối
      this.globalService.changeOrderListChats.next(true);
      this.getInfoToContact(this.selectedChat['id']);
    })
  }

  acceptRequest() {
    if ($bean.isNotEmpty(this.requestChat)) {
      let url = this.baseUrl + 'users/acceptRequest';
      let form = {
        requestId: this.requestChat['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Accept chat');
        console.log(data);
        this.requestChat = data;
        this.getInfoToChannel(this.requestChat['channelId']);
      })
    }
  }


  rejectRequest() {
    if ($bean.isNotEmpty(this.requestChat)) {
      let url = this.baseUrl + 'users/rejectRequest';
      let form = {
        requestId: this.requestChat['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Reject Chat');
        console.log(data);
        this.requestChat = data;
        this.firstAccess = true;
        this.globalService.changeOrderListChats.next(true);
      })
    }
  }

  deleteRequest() {
    if ($bean.isNotEmpty(this.requestChat)) {
      let url = this.baseUrl + 'users/deleteRequest';
      let form = {
        requestId: this.requestChat['id']
      }
      this.http.post(url, form).subscribe(data => {
        console.log('Delete chat');
        console.log(data);
        this.firstAccess = true;
        this.globalService.changeOrderListChats.next(true);
      })
    }
  }


// // Lấy danh sách người dùng hệ thống
// getListUser() {
//   const url = this.baseUrl + 'users';
//   this.http.get(url).subscribe(data => {
//     if ($bean.isNotNil(data)) {
//       this.listUser = data;
//     } else {
//       console.log('Empty users');
//     }
//   });
// }
//
// // Truy cập vào channel
// selectChannel(channel) {
//   if ($bean.isNotEmpty(channel) && channel.id !== this.selectedChat.id) {
//     this.selectedChat = channel;
//     this.listMessageByChannel = [];
//     this.accessChannel(this.selectedChat.id);
//   }
// }

// // Lấy những message đầu tiên và bắt đầu lắng nghe kênh
// accessChannel(channelId) {
//   this.getFirstListMessage(channelId, this.DEFAULT_NUMBER_MESSAGE, this.DEFAULT_NUMBER_OFSET);
//   this.listenChannel(channelId);
// }

// Lắng nghe kênh channel
  listenChannel(channelId) {
    const url = this.baseUrl + 'subChannel';
    const formData = {
      channelId: channelId
    };
    this.http.post(url, formData).subscribe(data => {
      if ($bean.isNotEmpty(data) && data['notification'] == this.STATUS_NOTIFICATION) {
        this.subChannel(data['channelId']);
      }
    }, error => {
      console.log('Something went wrong ', error);
    });
  }

//  connect Pushstream server

  initConnectPushStream() {
    this.pushStreamClient.onmessage = this.messageReceived.bind(this);
    this.pushStreamClient.connect();
  }

// subcribe channel
  subChannel(channelId) {
    this.pushStreamClient.disconnect();
    const option = null;
    console.log(this.pushStreamClient.channels);
    this.pushStreamClient.addChannel(channelId, option);
    this.pushStreamClient.onmessage = this.messageReceived.bind(this);
    this.pushStreamClient.connect();
    console.log('Count sub channel : ' + this.pushStreamClient.channelsCount);
  }

  removeAllChannel() {
    this.pushStreamClient.removeAllChannels();
    console.log('Count sub channel : ' + this.pushStreamClient.channelsCount);
  }

  // Unsubcribe channel
  unSubChannel(channelId) {
    this.pushStreamClient.removeChannel(channelId);
    console.log('Count sub channel : ' + this.pushStreamClient.channelsCount);
  }

  addUserToChat() {
    $('#modalDetailAddUserToChat').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.addUserToChat.next({channelId: this.requestChat['channelId']});
  }

  addNewChannel() {
    $('#modalInitAddChannel').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.newChannel.next({members: [this.selectedChat['id']]});
  }

  addMoreUser() {
    if (this.selectedChat['role'] == this.ROLE_IS_CHANNEL) {
      this.addUserToChat();
    } else {
      this.addNewChannel();
    }
  }

  getInfoChannel(channelId) {
    let url = this.baseUrl + 'channels/infoChannel';
    let form = {
      channelId: channelId
    }
    this.http.post(url, form).subscribe(channel => {
      if ($bean.isNotEmpty(channel)) {
        this.infoChannel = channel;
        if ($bean.isNotEmpty(this.infoChannel['users'])) {
          this.countMembers = this.infoChannel['users'].length;
        }
      }
    })
  }

  getInfoDetailChannel() {
    $('#modalBoxChat').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.infoChat.next({infoChat: this.infoChannel, linkUserChannel: this.requestChat});
  }

  getInfoDetailContact() {
    $('#modalBoxContact').modal('show');
    // reset lại giá trị của đối tượng newChannel
    this.globalService.infoContact.next({infoContact: this.selectedChat, linkUserChannel: this.requestChat});
  }

  showInfoChannel() {
    if (this.selectedChat['role'] == this.ROLE_IS_CHANNEL) {
      this.getInfoDetailChannel();
    } else {
      this.getInfoDetailContact();
    }
  }

// Handler xử lý message lắng nghe từ PushStream khi có message mới
  messageReceived(text, id, channelId) {
    this.dataFromPushstream = JSON.parse(text);
    console.log("Messenger Recieve :");
    console.log(this.dataFromPushstream);
    if ($bean.isNotEmpty(this.dataFromPushstream) && (channelId == this.requestChat['channelId'])) {
      switch (this.dataFromPushstream['type']) {
        case this.TYPE_NEW_MESSENGER: {
          // Kiểm tra nếu người dùng mới Accept và channel thì sẽ lấy lại dữ liệu message
          this.listMessages.push(this.dataFromPushstream['value']);
          this.moveToLastMessage();
          break;
        }
        case this.TYPE_UPDATED_MESSENGER: {
          if ($bean.isNotEmpty(this.listMessages)) {
            for (let i = 0; i < this.listMessages.length; i++) {
              if (this.listMessages[i].id == this.dataFromPushstream['value'].id) {
                this.listMessages[i] = this.dataFromPushstream['value'];
                break;
              }
            }
          }
          break;
        }
        case this.TYPE_DELETED_MESSENGER: {
          if ($bean.isNotEmpty(this.listMessages)) {
            for (let i = 0; i < this.listMessages.length; i++) {
              if (this.listMessages[i].id == this.dataFromPushstream['value'].id) {
                this.listMessages.splice(i, 1);
                break;
              }
            }
          }
          break;
        }
        case this.TYPE_NEW_REACT: {
          if ($bean.isNotEmpty(this.listMessages)) {
            for (let i = 0; i < this.listMessages.length; i++) {
              if (this.listMessages[i].id == this.dataFromPushstream.messengerId) {
                if ($bean.isEmpty(this.listMessages[i]['userMessengers'])) {
                  this.listMessages[i]['userMessengers'] = [];
                }
                this.listMessages[i]['userMessengers'].push(this.dataFromPushstream.value);
                this.listMessages[i]['userMessengers'] = this.refreshReactMessenger(this.listMessages[i]['userMessengers']);
                break;
              }
            }
          }
          break;
        }
        case this.TYPE_DELETED_REACT: {
          if ($bean.isNotEmpty(this.listMessages)) {
            for (let i = 0; i < this.listMessages.length; i++) {
              if (this.listMessages[i].id == this.dataFromPushstream.messengerId) {
                if ($bean.isNotEmpty(this.listMessages[i]['userMessengers'])) {
                  for (let j = 0; j < this.listMessages[i]['userMessengers'].length; j++) {
                    if (this.listMessages[i]['userMessengers'][j].id == this.dataFromPushstream.value.id) {
                      this.listMessages[i]['userMessengers'].splice(j, 1);
                      this.listMessages[i]['userMessengers'] = this.refreshReactMessenger(this.listMessages[i]['userMessengers']);
                      break;
                    }
                  }
                }
                break;
              }
            }
          }
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    }
  }

// // Lấy danh sách những message đầu tiên
// getFirstListMessage(channelId, number, offset) {
//   const formData = {
//     channelId,
//     number: this.getNumber(number, 'message'),
//     offset: this.getOffset(offset)
//   };
//   const url = this.baseUrl + 'messengerByNumber';
//   this.http.post(url, formData).subscribe(data => {
//     if ($bean.isNotNil(data)) {
//       this.listMessageByChannel = data;
//       // Reverse data
//       this.listMessageByChannel.reverse();
//       this.moveToLastMessage();
//     }
//   }, error => {
//     console.log('Something went wrong ', error);
//   });
// }

// Gửi mesage trên channel đang truy cập
  sendMessage() {
    if (this.processUpload) {
      this.upload();
    } else {
      if (!this.processUpdateMessenger) {
        this.sendText();
      } else {
        this.updateMessenger();
      }
    }
  }

  sendText() {
    if ($bean.isNotEmpty(this.inputValue)) {
      const message = {
        channelId: this.requestChat['channelId'],
        message: this.inputValue
      };
      const channelIdentifier = 'channel' + '_' + this.requestChat['channelId'];
      // const url = this.baseUrl + 'pub?id=' + channelIdentifier;
      const url = this.baseUrl + 'messengers/insert';
      // let url = this.baseUrl + 'users/sendMesssage'
      this.http.post(url, message).subscribe((data: any) => {
        if ($bean.isNotNil(data)) {
          console.log(data);
          this.inputValue = '';
          // cursor to the lastest messeage
          this.moveToLastMessage();
        }
      }, error => {
        console.log('Something went wrong ', error);
      });
    }
  }

// Scroll xuống message cuối cùng trên kênh
  moveToLastMessage() {
    this.scrollToElement('last-message');
  }

// Scroll xuống vị trí được chỉ định

  scrollToElement(idElement) {
    const element = document.getElementById(idElement);
    if ($bean.isNotNil(element)) {
      element.scrollIntoView(false);
    }
  }

// Lấy các messenger cũ
  loadPreviousMessenger(numberMessage) {
    let a = 0;
    const containerMessenger = document.getElementById('container-messenger');
    if (containerMessenger.scrollTop === 0) {
      a++;
      console.log(a);
      const formData = {
        channelId: this.requestChat['channelId'],
        number: 20,
        offset: this.listMessages.length
      };
      const url = this.baseUrl + 'messengers/byChannel';
      this.http.post(url, formData).subscribe(data => {
        if ($bean.isNotNil(data)) {
          this.moreMessage = data;
          if ($bean.isNotEmpty(this.moreMessage)) {
            console.log(this.moreMessage);
            // Mark phần tử để scroll xuống sau khi load thêm dữ liệu
            this.moreMessage[0].isMark = this.PREFIX_MARK_ELEMENT + '-' + this.listMessages.length;
            this.currentMarkPosition = this.PREFIX_MARK_ELEMENT + '-' + this.listMessages.length;
            for (let message of this.moreMessage) {
              this.listMessages.splice(0, 0, message);
            }
            if ($bean.isNotEmpty(this.currentMarkPosition)) {
              this.scrollToElement(this.currentMarkPosition);
            }
          }
        }
      }, error => {
        console.log('Something went wrong ', error);
      });
    }
  }


// Bắt sự kiện người dùng enter gửi dữ liệu
  checkSendMessage(event) {
    if (event.keyCode === this.ENTER_KEY_CODE) {
      this.sendMessage();
    }
  }

  updateMessenger() {
    if ($bean.isNotEmpty(this.inputValue)) {
      let updateMessenger = {
        id: this.selectedMessenger.id,
        message: this.inputValue
      }
      let url = this.baseUrl + 'messengers/update';
      this.http.post(url, updateMessenger).subscribe(data => {
        console.log('Updated Messenger');
        console.log(data);
        this.inputValue = '';
        this.processUpdateMessenger = false;
      })
    }
  }

  deleteMessenger(messengerId) {
    let url = this.baseUrl + 'messengers/delete';
    let form = {
      messengerId: messengerId
    }
    this.http.post(url, form).subscribe(data => {
      console.log('Deleted messenger');
      console.log(data);
    })
  }

  showGalleryBox() {
    $('#galleryModalBox').modal('show');
  }

  deleteUploadFile(idFile) {
    if ($bean.isNotEmpty(this.uploadFiles)) {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        if (this.uploadFiles[i].id == idFile) {
          this.uploadFiles.splice(i, 1);
        }
      }
    }
    if ($bean.isEmpty(this.uploadFiles)) {
      this.processUpload = false;
    }
  }

  cancelUploadFile() {
    this.processUpload = false;
    this.uploadFiles = [];
  }

  doUpload(event) {
    console.log(event);
    event.stopPropagation();
    event.preventDefault();
    let files = event.target.files;
    if ($bean.isNotEmpty(files)) {
      for (let i = 0; i < files.length; i++) {
        this.addFileToUpload(files[i]);
      }
    }
    if ($bean.isNotEmpty(this.uploadFiles)) {
      this.processUpload = true;
    }
    // $('input[type="file"]').val('');
    // this.upload(this.uploadFiles);
  }

  addFileToUpload(file) {
    if (file) {
      let typeFile = (file.type.includes('image')) ? this.TYPE_MESSENGER_IMAGE : this.TYPE_MESSENGER_FILE;
      let url = undefined;
      if (typeFile == this.TYPE_MESSENGER_IMAGE) {
        console.log('preview image');
        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          url = event.target['result'];
          let objFile = {
            id: $bean.genRandomID(16),
            type: typeFile,
            file: file,
            url: url
          }
          this.uploadFiles.push(objFile);
          if ($bean.isNotEmpty(this.uploadFiles)) {
            this.processUpload = true;
          }
        }
      } else {
        let objFile = {
          id: $bean.genRandomID(16),
          type: typeFile,
          file: file
        }
        this.uploadFiles.push(objFile);
      }
    }
  }

  upload() {
    let uploadFilesClone = $bean.clone(this.uploadFiles);
    let attachMessage = this.inputValue;
    this.finishUploadFiles();
    if ($bean.isNotEmpty(uploadFilesClone)) {
      let url = this.baseUrl + 'upload';
      for (let i = 0; i < uploadFilesClone.length; i++) {
        const formData = new FormData();
        formData.append('channelId', this.requestChat['channelId']);
        formData.append('fileId', uploadFilesClone[i].id);
        formData.append('file', uploadFilesClone[i].file);
        if ($bean.isNotEmpty(attachMessage) && (i == (uploadFilesClone.length - 1))) {
          formData.append('message', attachMessage);
        }
        this.http.post(url, formData).subscribe(data => {
          console.log(data);
        })
      }
    }
  }

  finishUploadFiles() {
    this.processUpload = false;
    this.uploadFiles = [];
    this.inputValue = '';
  }

  chooseFile() {
    $('input[type="file"]').val('');
    $('#inputFile').trigger('click');
  }

  allowDrop(ev, showBorder) {
    ev.preventDefault();
    if (showBorder) {
      event.target['style'].border = "4px dotted green";
    }
  }

  dropIntoBoxSend(ev) {
    ev.preventDefault();
    let files = ev.dataTransfer.files;
    if ($bean.isNotEmpty(files)) {
      for (let i = 0; i < files.length; i++) {
        this.addFileToUpload(files[i]);
      }
    }
    event.target['style'].border = "none";
  }

  dropIntoBoxMessage(ev) {
    ev.preventDefault();
    let files = ev.dataTransfer.files;
    if ($bean.isNotEmpty(files)) {
      let url = this.baseUrl + 'upload';
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('channelId', this.requestChat['channelId']);
        formData.append('fileId', $bean.genRandomID(16));
        formData.append('file', files[i]);
        this.http.post(url, formData).subscribe(data => {
          console.log(data);
        })
      }
    }
    event.target['style'].border = "none";
  }

  handleClick(evt: EmojiEvent) {
    console.log(evt.emoji);
    let selectedEmoji = evt.emoji;
    this.inputValue += selectedEmoji.native;
  }

  emojiClick(evt: EmojiEvent) {
    console.log(evt.emoji);
    console.log(evt.$event);
  }

  showBoxEmojis(event, triggerId, classBoxEmoji) {
    let triggerElement = $('#' + triggerId);
    let triggerTop = triggerElement.offset().top;
    let triggerLeft = triggerElement.offset().left;
    let outerWidthTrigger = triggerElement.outerWidth();
    let outerHeightTrigger = triggerElement.outerHeight();
    let emojisBox = $('.' + classBoxEmoji);
    let outerWidthEmojisBox = emojisBox.outerWidth();
    let outerHeightEmojisBox = emojisBox.outerHeight();
    let emojisBoxTop = triggerTop - 10 - outerHeightEmojisBox;
    let emojesBoxLeft = triggerLeft + outerWidthTrigger / 2 - outerWidthEmojisBox / 2;
    if (classBoxEmoji == this.CLASS_BOX_MESSAGE_EMOJIS) {
      this.styleBoxMessageEmojis.top = emojisBoxTop;
      this.styleBoxMessageEmojis.left = emojesBoxLeft;
      console.log(this.styleBoxMessageEmojis);
    } else {
      this.styleBoxReactEmojis.top = emojisBoxTop;
      this.styleBoxReactEmojis.left = emojesBoxLeft;
      console.log(this.styleBoxReactEmojis);
    }
    event.stopPropagation();
  }

  showBoxMessageEmojis(event) {
    this.showBoxEmojis(event, 'icon-message-emojis', this.CLASS_BOX_MESSAGE_EMOJIS);
  }


  hideBoxMessageEmojis() {
    this.styleBoxMessageEmojis.top = -1000;
    this.styleBoxMessageEmojis.left = -1000;
  }

  getEmojisDefault() {
    let url = this.baseUrl + 'emojis';
    this.http.get(url).subscribe(emojis => {
      this.listEmojis = emojis;
    })
  }

  showBoxReactEmojis(event, triggerId, messenger) {
    this.showBoxEmojis(event, triggerId, this.CLASS_BOX_REACT_EMOJIS);
    this.selectedMessenger = messenger;
  }

  hideBoxReactEmojis() {
    this.styleBoxReactEmojis.top = -1000;
    this.styleBoxReactEmojis.left = -1000;
  }

  reactMessenger(emoji) {
    if ($bean.isNotEmpty(this.selectedMessenger['userMessengers'])) {
      let reactMessengers = this.selectedMessenger['userMessengers'];
      let found = false;
      for (let i = 0; i < reactMessengers.length; i++) {
        if ((reactMessengers[i].userId == this.userLogin.id) && (reactMessengers[i].emoji == emoji.native)) {
          this.deleteReactMessenger(reactMessengers[i]);
          found = true;
          break;
        }
      }
      if (!found) {
        this.newReactMessenger(emoji);
      }
    } else {
      this.newReactMessenger(emoji);
    }
  }

  newReactMessenger(emoji) {
    console.log(emoji);
    let url = this.baseUrl + 'userMessengers/reactMessenger';
    let form = {
      userId: this.userLogin.id,
      messengerId: this.selectedMessenger.id,
      channelId: this.selectedMessenger.channelId,
      emoji: emoji.native
    }
    this.http.post(url, form).subscribe(data => {
      console.log('React message ');
      console.log(data);
    })
  }

  deleteReactMessenger(react) {
    let url = this.baseUrl + 'userMessengers/deleteReact';
    let form = {
      userMessengerId: react.id
    }
    this.http.post(url, form).subscribe(data => {
      console.log('Delete react ');
      console.log(data);
    })
  }

  showBoxMessageActivities(messenger, triggerId, elementTagId, event) {
    this.selectedMessenger = messenger;
    console.log('Selected messenger');
    console.log(this.selectedMessenger);
    this.setUpActivites(messenger);
    let triggerElement = $('#' + triggerId);
    let triggerTop = triggerElement.offset().top;
    let triggerLeft = triggerElement.offset().left;
    let outerWidthTrigger = triggerElement.outerWidth();
    let outerHeightTrigger = triggerElement.outerHeight();
    let activitiesMessageBox = $('.' + this.CLASS_BOX_MESSAGE_ACTIVITIES);
    let outerWidthActivitiesMessageBox = activitiesMessageBox.outerWidth();
    let outerHeightActivitiesMessageBox = activitiesMessageBox.outerHeight();
    let activitiesMessageBoxTop = triggerTop - outerHeightActivitiesMessageBox / 2;
    let activitiesMessageBoxLeft = triggerLeft - outerWidthTrigger - outerWidthActivitiesMessageBox - 10;
    this.styleBoxMessageActivities.top = activitiesMessageBoxTop;
    this.styleBoxMessageActivities.left = activitiesMessageBoxLeft;
    this.selectedMessageElementId = elementTagId;
    console.log(this.styleBoxMessageActivities);
    event.stopPropagation();
  }

  hideBoxMessageActivities() {
    this.styleBoxMessageActivities.top = -1000;
    this.styleBoxMessageActivities.left = -1000;
  }

  setUpActivites(messenger) {
    if ($bean.isNotNil(messenger.path)) {
      this.setUpActivitiesObj.download = true;
    }
  }

  beginUpdateMessenger() {
    this.processUpdateMessenger = true;
    this.inputValue = this.selectedMessenger.message;
  }

  copyMessenger() {
    this.processCopyMessenger = true;
    if ($bean.isNotEmpty(this.selectedMessageElementId)) {
      $('#inputCopy').val($('#' + this.selectedMessageElementId).html());
      $('#inputCopy').select();
      document.execCommand("copy");
      alert("Copied the text: " + $('#inputCopy').val());
      this.processCopyMessenger = false;
    } else {
      alert('Ban chua chon message !');
    }
  }

  // downloadFile() {
  //   let url = this.baseUrl + 'attachments/' + this.selectedMessenger.path;
  //   this.http.get(url).subscribe(data => {
  //     console.log('Download');
  //     console.log(data);
  //   })
  // }

  beginForwardMessenger() {
  }

  beginRemoveMessenger() {
    this.removeMessenger();
  }

  removeMessenger() {
    let url = this.baseUrl + 'messengers/delete';
    let form = {
      messengerId: this.selectedMessenger.id
    }
    this.http.post(url, form).subscribe(data => {
      console.log('Delete messenger');
      console.log(data);
    })
  }

  refreshReactMessenger(reacts) {
    let cloneReacts = $bean.clone(reacts);
    return cloneReacts;
  }

}
