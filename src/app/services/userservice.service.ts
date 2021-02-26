import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient ,HttpHeaders,} from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
 loggedIn=new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient,private router:Router) { }
  
  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }
 
  Login(data: any) {
    
    return new Promise((resolve, reject) => {
      this.http.post(environment.Api_URL +'login',data).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  verficarrecaptcha(datos :any){
    return new Promise((resolve, reject)=>{  
      this.http.post(environment.Api_URL+'verificar',datos).subscribe(
       (res) => {
         resolve(res);
       },
       (error) => {
         reject(error);
       }
      );
     })
  }
  CheckToken():void {
   
    const UserToken= localStorage.getItem('token');
    const IsExpired=helper.isTokenExpired(UserToken);
    if(IsExpired){
       
       this.router.navigate(['/']);
    }else{
      this.loggedIn.next(true);
    }
   }
  logout(){
    let headers= new HttpHeaders();
    const token= localStorage.getItem('token');
    headers= headers.append('Authorization','bearer '+token);
    return new Promise((resolve, reject)=>{
    this.http.post(environment.Api_URL+'logout',token,{headers:headers}).subscribe(
      (res) => {
        localStorage.removeItem('token')
        this.loggedIn.next(false);
        resolve(res);
      },
      (error) => {
        reject(error);
      })
    });   
  }
  registrar(data:any){
    
    return new Promise((resolve, reject)=>{
      this.http.post(environment.Api_URL+'register',data).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        })
      });   
  }
  motrardatosuser(){
    let headers= new HttpHeaders();
    const token= localStorage.getItem('token');
    headers= headers.append('Authorization','bearer '+token);
    return new Promise((resolve, reject)=>{
      this.http.get(environment.Api_URL+'perfil',{headers:headers}).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        })
      });   
  }
}
