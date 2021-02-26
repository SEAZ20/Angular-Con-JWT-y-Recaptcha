import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserserviceService } from '../services/userservice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  siteKey:string;
  constructor(private fb:FormBuilder, private userservice:UserserviceService, private route:Router) { 
    this.siteKey="6LeGE2UaAAAAADiYYpJCNEGLd6w11IIbDoQ8zHMx";
  }

  //sitio= 6LeGE2UaAAAAADiYYpJCNEGLd6w11IIbDoQ8zHMx
  //servidor=6LeGE2UaAAAAAG7cNxLmyZRLr_hCMtu8VonTudvx
  ngOnInit(): void {
    this.userservice.CheckToken();
  }
  aFormGroup = this.fb.group({
    email: ['',[Validators.email,Validators.required]],
    password: ['',Validators.required],
    recaptcha: ['', Validators.required]
  });
  codigo:string;
  tokencorrecto:string;
 
  login(){
    if(this.aFormGroup.get('email').value==""){
      this.mostrarAlerta('error','Oops...','ingrese su email');
      
    }else{
      if(this.aFormGroup.get('password').value==""){
        this.mostrarAlerta('error','Oops...','ingrese su contraseña');
      }else{
        if (this.aFormGroup.get('recaptcha').value=="") {
          this.mostrarAlerta('error','Oops...','Confirme si es un humano');
        } else {
          if(this.aFormGroup.valid){
            Swal.fire({
              title:'Espere',
              titleText: 'Validando datos...',
              icon:'info',
              allowOutsideClick: false
            })
            Swal.showLoading();
            this.tokencorrecto=this.aFormGroup.get('recaptcha').value;
            let datos={
              'token': this.tokencorrecto
            }
            this.userservice.verficarrecaptcha(datos).then((data)=>{
              this.codigo=data["code"];
              if(this.codigo=="200"){  
                const user= this.aFormGroup.value;
                this.userservice.Login(user).then((data)=>{
                this.codigo=data["code"];
                if (this.codigo=="200") {
                  Swal.hideLoading();
                  Swal.close();
                  this.userservice.loggedIn.next(true);
                  localStorage.setItem('token',data['token']);
                  this.route.navigate(['/home']);
                } else {
                  if (this.codigo=="401") {
                    this.mostrarAlerta('error','Oops...',data['message']);
                  } else {
                    this.mostrarAlerta('error','Oops...','Error del servidor');
                  }
                }
               })
              }else{
                this.mostrarAlerta('error','Oops...','No eres un Humano');
              }
            })
            
          }else{
            this.mostrarAlerta('error','Oops...','Formato de correo incorrecto');
          }
        }
      }
    }
  }
  
  mostrarAlerta(icon:string,title:string, text:string){ 
      Swal.fire({
       icon,
        title,
        text,
      })
  }
}
