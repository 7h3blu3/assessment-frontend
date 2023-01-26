import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './admin/panel/panel.component';
import { ArchivedScenariosComponent } from './admin/scenarios/archived-scenarios/archived-scenarios.component';
import { AssignScenariosComponent } from './admin/scenarios/assign-scenarios/assign-scenarios.component';
import { CreateScenarioComponent } from './admin/scenarios/create-scenario/create-scenario.component';
import { ListScenariosComponent } from './admin/scenarios/list-scenarios/list-scenarios.component';
import { SubmissionGradeComponent } from './admin/submission-grade/submission-grade.component';
import { ArchivedUsersComponent } from './admin/users/archived-users/archived-users.component';
import { ListUsersComponent } from './admin/users/list-users/list-users.component';
import { UserSubmissionComponent } from './admin/users/user-submission/user-submission.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AssessmentComponent } from './user/assessment/assessment.component';
import { StartAssessmentComponent } from './user/start-assessment/start-assessment.component';
import { PendingChangesGuard } from './pending-changes/guard';
import { HistoryLogComponent } from './admin/history-log/history-log.component';
import { ListScenariosListComponent } from './admin/scenarios/list-scenarios-list/list-scenarios-list.component';

const routes: Routes = [
  { path: '', component: StartAssessmentComponent, canActivate:[AuthGuard] },
  { path: 'assessment', component: AssessmentComponent, canActivate:[AuthGuard], canDeactivate: [PendingChangesGuard] },
  { path: "admin/panel", component:PanelComponent },
  { path: "admin/list-users", component:ListUsersComponent, canActivate:[AuthGuard] },
  { path: "admin/archived-users", component:ArchivedUsersComponent, canActivate:[AuthGuard] },
  { path: "admin/create-scenarios", component:CreateScenarioComponent, canActivate:[AuthGuard] },
  { path: "admin/list-scenarios", component:ListScenariosComponent, canActivate:[AuthGuard] },
  { path: "admin/archived-scenarios", component:ArchivedScenariosComponent, canActivate:[AuthGuard] },
  { path: "admin/assign-scenarios", component:AssignScenariosComponent, canActivate:[AuthGuard] },
  { path: "admin/user-submission", component:UserSubmissionComponent,canActivate:[AuthGuard] },
  { path: "admin/history-log", component:HistoryLogComponent,canActivate:[AuthGuard] },
  { path: "admin/submission-grade/:userId/:scenarioId", component:SubmissionGradeComponent, canActivate:[AuthGuard] },
  { path: "login", component:LoginComponent },
  { path: "signup", component:SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
