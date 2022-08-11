import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HistoryLog } from "./history-log.model";

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class HistoryLogService {


    constructor(private http: HttpClient) {

    }

    public handleError(error: Response | any) {
        let errMsg = ""
        if (error instanceof Response || error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 0:
              errMsg = "No Response Received. Check your network connection.";
              break;
            case 404:
              errMsg = "404 not found, please contact the administrator";
              break;
            case 500:
              errMsg = "500 internal error, please contact the administrator";
              break;
            case 405:
              errMsg = "405 method not allowed";
              break;
            default:
              break;
          }
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        Swal.fire({
          title:"There was an error",
          icon: 'error',
          text: "Error message " + errMsg,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: 'blue'
        })
        return observableThrowError(errMsg);
      }

    getHistoryLog(): Observable<any>{
        return this.http.get(environment.apiUrl +"/admin/history-log").pipe(map(res => { return res }), catchError(this.handleError))
      }

    clearHistoryLog(): Observable<any>{
      return this.http.get(environment.apiUrl +"/admin/clear-log").pipe(map(res => { return res }), catchError(this.handleError))
    }

    postHistoryLog(historyContent, userId): Observable<any> {

        console.log("historyContent ", historyContent)
        const historyLogData: HistoryLog = {
            historyContent: historyContent,
            userId: userId
        };

        return this.http.post<any>(environment.apiUrl + '/admin/history-log', historyLogData).pipe(map(res => { return res }), catchError(this.handleError))
      }

    confirmAlert(keyword) {
        let title, icon, confirmButtonColor, confirmButtonText;
        if(keyword == "erase") {
          title = "Are you sure you want to copmpletely erase <strong>ALL</strong> History Logs ?";
          icon = "warning";
          confirmButtonColor = "#FA4A1E";
          confirmButtonText = "Erase!";
        }
        else if (keyword == "export") {
          title = "Are you sure you want to export History Log ?";
          icon = "question";
          confirmButtonColor = "#198C19";
          confirmButtonText = "Export!"
        } 
        return Swal.fire({
          title: title,
          icon: icon,
          showCancelButton: true,
          confirmButtonColor: confirmButtonColor,
          cancelButtonColor: '#3F51B5',
          confirmButtonText: confirmButtonText
        })
      }

      successAlert(keyword) {
        let title, text;
        if(keyword == "erase") {
          title = "Erased!";
          text = "History log completely erased and a copy has been exported.";
        }
        else if (keyword == "export") {
          title = "Export!";
          text = "History log exported into an excel file.";
        } 
        return Swal.fire({
          title:title,
          text:text,
          icon:'success',
          confirmButtonColor: '#3F51B5',
        })
      }
    
}