import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../services/userservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private userser:UserserviceService) { }

  ngOnInit(): void {
    
    this.userser.CheckToken();
    
  }

  nombre="";
  email="";
  codigo:string;
  validar=false;
  datos:any=[];

  mostrar(){
    this.validar=true;
    this.userser.motrardatosuser().then((data)=>{
      this.codigo=data["code"];
      if(this.codigo=="200"){
        this.datos=data["user"];
       
      }
    }).catch((error) => {
      
    });
  }
}
