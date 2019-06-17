import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {ChannelViewChatsComponent} from "./channel/view-chats/channel-view-chats.component";
import {ChannelViewContactsComponent} from "./channel/view-contacts/channel-view-contacts.component";
import {ChannelSearchViewAllComponent} from "./channel/search-view-all/channel-search-view-all.component";
import {ChannelSearchViewPeopleComponent} from "./channel/search-view-people/channel-search-view-people.component";
import {ChannelSearchViewGroupComponent} from "./channel/search-view-group/channel-search-view-group.component";

const routes: Routes = [
  {
    path: "", component: ChannelViewChatsComponent
  },
  {
    path: "contacts", component: ChannelViewContactsComponent
  },
  {
    path: "search?filter=all", component: ChannelSearchViewAllComponent
  },
  {
    path: "search?filter=people", component: ChannelSearchViewPeopleComponent
  },
  {
    path: "search?filter=groups", component: ChannelSearchViewGroupComponent
  },

  {path: "**", component: ChannelViewChatsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes, {
      enableTracing: false
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
