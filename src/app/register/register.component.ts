import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserserviceService } from '../services/userservice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb:FormBuilder, private userser:UserserviceService,private route:Router) { }
  islogged2=false;
  ngOnInit(): void {
    this.userser.isLogged.subscribe((res)=>this.islogged2=res);
    if (this.islogged2==true) {
      this.route.navigate(['/home']);
    } 
  }

  aFormGroup = this.fb.group({
    name:['',Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password: ['',Validators.required]
  });
  codigo: string;
 
  registrar(){
    if (this.aFormGroup.valid) {
      Swal.fire({
        title:'Espere',
        titleText: 'Resgistrando...',
        icon:'info',
        allowOutsideClick: false
      })
      Swal.showLoading();
      const datos = this.aFormGroup.value;
      this.userser.registrar(datos).then((data)=>{
        this.codigo=data["code"];
        if(this.codigo=="201"){
          Swal.hideLoading();
          Swal.close();
          this.route.navigate([''])
        }
      }).catch((error) => {
      
      });
    } else {
      this.mostrarAlerta('error','Oops...','Faltá campos por completar o el correo no tiene formato correcto');
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
