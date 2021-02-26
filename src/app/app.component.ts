import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take ,map} from 'rxjs/Operators';
import { UserserviceService } from './services/userservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'TrabajoFinalAngular';
  islogged=false;
  ngOnInit(): void {
  this.userservice.CheckToken();
   this.userservice.isLogged.subscribe((res)=>this.islogged=res);
   
  }
 

  constructor(private userservice: UserserviceService, private route:Router){

  }
  codigo:string;
  logoutuser(){
    this.userservice.logout().then((data)=>{
      this.codigo=data["code"];
      if(this.codigo=="200"){
        localStorage.removeItem('token');
        this.route.navigate(['/']);
       
      }
    }).catch((error) => {
      
    });
  }
  
}
