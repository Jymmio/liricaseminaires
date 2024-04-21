import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isAdded : boolean = false;
  isAddedAnimation : boolean = true;
  verifyFirstName : boolean = false;
  verifyLastName : boolean = false;
  verifyEmail : boolean = false;
  verifyPassword : boolean = false;
  emailErrorMesssage: String = "";

  constructor(private userService: UserService,
    private  ngxUiLoaderService: NgxUiLoaderService,
    public gs: GlobalService,
    private router: Router){}
  form: FormGroup = new FormGroup({
    lastName: new FormControl(''),
    firstName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });
  async signupAction(){
    var emailControl = this.form.get('email');
    var passwordControl = this.form.get('password');
    var firstNameControl = this.form.get('firstName');
    var lastNameControl = this.form.get('lastName');
    var data = {
      lastName: "",
      firstName: "",
      email: "",
      password: ""
    }
    if (emailControl) {
      const email = emailControl.value;
      data.email = email;
    } else {
      console.log('Email control is not found');
    }
    if(passwordControl){
      const password = passwordControl.value;
      data.password = password;
    } else {
      console.log("Password control is not found");
    }
    if (firstNameControl) {
      const first = firstNameControl.value;
      data.firstName = first;
    } else {
      console.log('Email control is not found');
    }
    if(lastNameControl){
      const last = lastNameControl.value;
      data.lastName = last;
    } else {
      console.log("Password control is not found");
    }

    if(data.firstName !== "" && data.lastName !== "" && data.password.length >= 8 && this.validateEmail(data.email)){
      this.ngxUiLoaderService.start();
      this.userService.signup(data).subscribe((res:any)=>{
        this.switchSuccess();
        setTimeout(() =>{
          this.ngxUiLoaderService.stop();
          if(res?.message === "compte enregistré !"){
            this.router.navigate(['/home']);
        }
        }, 2500);

      }, (err) => {
        this.ngxUiLoaderService.stop();
        if(err.error?.message){
          console.log(err.error?.message);
        }
        else{
          console.log('une erreur est survenue.');
        }
      });
    }
    else{
      if(!this.validateEmail(data.email)){
        this.verifyEmail = true;
        if(data.email===""){
          this.emailErrorMesssage = "Veuillez entrer votre adresse mail *";
        }
        else{
          this.emailErrorMesssage = "votre email doit être sous forme \"mots@domaine.xy\"";
        }
      }
      else{
        this.verifyEmail = false;
      }
      if(data.firstName===""){
        this.verifyFirstName = true;
      }
      else{
        this.verifyFirstName = false;
      }
      if(data.lastName===""){
        this.verifyLastName = true;
      }
      else{
        this.verifyLastName = false;
      }
      if(data.password.length<8){
        this.verifyPassword = true;
      }
      else{
        this.verifyPassword = false;
      }

      this.ngxUiLoaderService.stop();
    }
  }
  validateEmail(email: string): boolean {
    const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async switchSuccess(){
    this.isAdded = true;
    this.isAddedAnimation = true;
    await this.sleep(2000);
    this.isAddedAnimation = false;
    setTimeout(()=> {
      this.isAdded = false;
    }, 500);
  }
}
