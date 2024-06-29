import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {FeedbackService} from 'src/app/services/feedback.service';
import {LoadingService} from 'src/app/services/loading.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  placeholderText: String =
    'Feedback (2-3 lines or as per your convenience) on my projects and also please comment on the suitability of my profile for the role in question. Feel free to add any other information as appropriate.';
  constructor(
    private l: LoadingService,
    private fService: FeedbackService,
    private router: Router
  ) {}

  onSubmit(f: NgForm) {
    let value = f.value;
    this.l.isLoading.next(true);

    this.fService
      .recordFeedback({companyName: value.name, feedback: value.feedback})
      .subscribe(() => {
        this.l.isLoading.next(false);
        this.router.navigate(['miscellaneous/recorded']);
      });
  }
}
