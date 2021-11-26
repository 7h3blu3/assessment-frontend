import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { ListScenariosComponent } from './admin/scenarios/list-scenarios/list-scenarios.component';
import { HeaderComponent } from './header/header.component';
import { CreateScenarioComponent } from './admin/scenarios/create-scenario/create-scenario.component';
import { PanelComponent } from './admin/panel/panel.component';
import { ListUsersComponent } from './admin/users/list-users/list-users.component';
import { ArchivedUsersComponent } from './admin/users/archived-users/archived-users.component';
import { ArchivedScenariosComponent } from './admin/scenarios/archived-scenarios/archived-scenarios.component';
import { AssignScenariosComponent } from './admin/scenarios/assign-scenarios/assign-scenarios.component';
import { UserSubmissionComponent } from './admin/users/user-submission/user-submission.component';
import { SubmissionGradeComponent } from './admin/submission-grade/submission-grade.component';
import { AssessmentComponent } from './user/assessment/assessment.component';
import { StartAssessmentComponent } from './user/start-assessment/start-assessment.component';
import { LoginComponent } from './auth/login/login.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignupComponent } from './auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    ListScenariosComponent,
    HeaderComponent,
    CreateScenarioComponent,
    PanelComponent,
    ListUsersComponent,
    ArchivedUsersComponent,
    ArchivedScenariosComponent,
    AssignScenariosComponent,
    UserSubmissionComponent,
    SubmissionGradeComponent,
    AssessmentComponent,
    StartAssessmentComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
