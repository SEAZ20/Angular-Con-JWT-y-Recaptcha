import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserserviceService } from '../services/userservice.service';
import { take,map } from 'rxjs/Operators';
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private seruser:UserserviceService){

  }
  canActivate(): Observable<boolean> {
    return this.seruser.isLogged.pipe(take(1),map((islogged:boolean)=> !islogged)
    );
  }
  
}
