import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './admin/panel/panel.component';
import { ArchivedScenariosComponent } from './admin/scenarios/archived-scenarios/archived-scenarios.component';
import { AssignScenariosComponent } from './admin/scenarios/assign-scenarios/assign-scenarios.component';
import { CreateScenarioComponent } from './admin/scenarios/create-scenario/create-scenario.component';
import { ListScenariosComponent } from './admin/scenarios/list-scenarios/list-scenarios.component';
import { ArchivedUsersComponent } from './admin/users/archived-users/archived-users.component';
import { ListUsersComponent } from './admin/users/list-users/list-users.component';
import { UserSubmissionComponent } from './admin/users/user-submission/user-submission.component';
import { StartAssessmentComponent } from './user/start-assessment/start-assessment.component';

const routes: Routes = [
  { path: '', component: StartAssessmentComponent },
  { path: "admin/panel", component:PanelComponent },
  { path: "admin/list-users", component:ListUsersComponent },
  { path: "admin/archived-users", component:ArchivedUsersComponent },
  { path: "admin/create-scenarios", component:CreateScenarioComponent },
  { path: "admin/list-scenarios", component:ListScenariosComponent },
  { path: "admin/archived-scenarios", component:ArchivedScenariosComponent },
  { path: "admin/assign-scenarios", component:AssignScenariosComponent },
  { path: "admin/user-submission", component:UserSubmissionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
