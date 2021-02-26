import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserserviceService } from '../services/userservice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NgxCaptchaModule,ReCaptcha2Component} from 'ngx-captcha';
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
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  //sitio= 6LeGE2UaAAAAADiYYpJCNEGLd6w11IIbDoQ8zHMx
  //servidor=6LeGE2UaAAAAAG7cNxLmyZRLr_hCMtu8VonTudvx
  ngOnInit(): void {
    this.userservice.CheckToken();
  }
  aFormGroup = this.fb.group({
    email: [null,[Validators.email,Validators.required]],
    password: [null,Validators.required],
    recaptcha: [null, Validators.required]
  });
  codigo:string;
  tokencorrecto:string;
  type: 'image';
  login(){
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
                  this.aFormGroup.reset();
                  //this.aFormGroup.controls['recaptcha'].setValue(null);
                  this.captchaElem.resetCaptcha();
                  //this.route.navigate(['/']);
                }
               })
              }else{
                this.mostrarAlerta('error','Oops...','No eres un Humano');
              }
            })
            
          }else{
            this.mostrarAlerta('error','Oops...','Campos sin completar, su correo es incorrecto o confirme se es un humano');
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
