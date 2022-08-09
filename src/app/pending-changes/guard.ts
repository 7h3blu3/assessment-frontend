import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    // if there are no pending changes, just allow deactivation; else confirm first

    return component.canDeactivate() ?
    true :
    // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
    // when navigating away from your angular app, the browser will show a generic warning message
    // see http://stackoverflow.com/a/42207299/7307355
    this.showAlert(component);
}

    showAlert(component){
      return Swal.fire({
        title: "Warning!",
        icon: "warning",
        html: "You will lose your changes if you navigate away, <strong> Submit </strong> changes or continue assessment.",
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: "Continue Assessment",
        cancelButtonText: "Lose Changes",
        allowOutsideClick: false
      }).then((result) => {
        console.log("result ", result)
            if (result.value) {
                return component.canDeactivate(), false
            } else {
                this.clearLocalStorageTimer();
                return component.canDeactivate(), true
            }
          })
    }

    private clearLocalStorageTimer() {
      localStorage.removeItem("assessmentExpiration")
    }
  }

 


