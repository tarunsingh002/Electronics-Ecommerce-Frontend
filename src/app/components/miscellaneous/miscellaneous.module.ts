import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutusComponent} from './aboutus/aboutus.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found-component/page-not-found.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackComponent} from './feedback/feedback.component';
import {FeedbackRecordedComponent} from './feedback-recorded/feedback-recorded.component';

const routes: Routes = [
  {
    path: 'contactus',
    component: ContactUsComponent,
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
  {
    path: 'recorded',
    component: FeedbackRecordedComponent,
  },
];

@NgModule({
  declarations: [
    AboutusComponent,
    ContactUsComponent,
    FeedbackComponent,
    FeedbackRecordedComponent,
  ],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule],
})
export class MiscellaneousModule {}
