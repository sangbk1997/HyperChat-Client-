import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {EmojiModule} from '@ctrl/ngx-emoji-mart/ngx-emoji'

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ChannelViewChatsComponent} from "./channel/view-chats/channel-view-chats.component";
import {ChannelViewContactsComponent} from "./channel/view-contacts/channel-view-contacts.component";
import {ChannelSearchViewGroupComponent} from "./channel/search-view-group/channel-search-view-group.component";
import {ChannelSearchViewAllComponent} from "./channel/search-view-all/channel-search-view-all.component";
import {ChannelSearchViewPeopleComponent} from "./channel/search-view-people/channel-search-view-people.component";
import {SideBarViewComponent} from "./sidebar/side-bar-view.component";
import {ModalAddChannelComponent} from "./modal/modal-add-channel/modal-add-channel.component";
import {ModalBoxGalleryComponent} from "./modal/modal-box-gallery/modal-box-gallery.component";
import {ModalUpdateProfileComponent} from "./modal/modal-update-profile/modal-update-profile.component";
import {ModalBoxNotificationComponent} from "./modal/modal-box-notification/modal-box-notification.component";
import {ModalBoxChatComponent} from "./modal/modal-box-chat/modal-box-chat.component";
import {ModalBoxMembersComponent} from "./modal/modal-box-members/modal-box-members.component";
import {ModalConfirmLogoutComponent} from "./modal/modal-confirm-logout/modal-confirm-logout.component";
import {ModalInfoSummaryComponent} from "./modal/modal-info-summary/modal-info-summary.component";
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {ModalBoxConfirmRequestComponent} from "./modal/modal-box-confirm-request/modal-box-confirm-request.component";
import {ModalAddUserToChatComponent} from "./modal/modal-add-user-to-chat/modal-add-user-to-chat.component";
import {ModalBoxContactComponent} from "./modal/modal-box-contact/modal-box-contact.component";
import {ModalBoxRequestComponent} from "./modal/modal-box-request/modal-box-request.component";
import {PrintDataPipe} from "../hyd/base/print-data.pipe";
import {BoxReactMessengerComponent} from "./box/box-react-messenger/box-react-messenger.component";
import {BoxReactEmojiUsersComponent} from "./box/box-react-emoji-users/box-react-emoji-users.component";
import {BoxUsersReadMessengerComponent} from "./box/box-users-read-messenger/box-users-read-messenger.component";

@NgModule({
  declarations: [
    AppComponent,
    ChannelViewChatsComponent,
    ChannelViewContactsComponent,
    ChannelSearchViewGroupComponent,
    ChannelSearchViewAllComponent,
    ChannelSearchViewPeopleComponent,
    SideBarViewComponent,
    ModalAddChannelComponent,
    ModalAddUserToChatComponent,
    ModalBoxGalleryComponent,
    ModalUpdateProfileComponent,
    ModalBoxNotificationComponent,
    ModalBoxChatComponent,
    ModalBoxRequestComponent,
    ModalBoxContactComponent,
    ModalBoxMembersComponent,
    ModalConfirmLogoutComponent,
    ModalInfoSummaryComponent,
    ModalBoxConfirmRequestComponent,
    BoxReactMessengerComponent,
    BoxReactEmojiUsersComponent,
    BoxUsersReadMessengerComponent,
    PrintDataPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    PickerModule,
    EmojiModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
