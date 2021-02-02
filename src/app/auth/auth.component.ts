import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  SignInMail
  SignInpassword
  UserName
  RePassword
  email
  pass
  EmailResetPassword
  registerForm: FormGroup;
  submitted = false;

  constructor(public toastr: ToastrManager,private  authService:  AuthService,private formBuilder: FormBuilder) { 
        
   this.registerForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
      
  }, {
      // validator:this.MustMatch('Password', 'RePassword')
  });



  }

  ngOnInit(): void {
    console.log(this.authService.IsLoggedIn())
    
  }
  get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
          
            return;
        }

        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.signin()
        setTimeout(() => {
          this.SignInpassword = null
          this.RePassword= null
          this.UserName = null
          this.SignInMail = null
          
        }, 1000);
      document.getElementById("reset").click()
       
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }
    MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
 
  signin(){
    if(this.SignInpassword==this.RePassword){
    
    this.authService.register(this.SignInMail,this.SignInpassword,this.UserName).then(()=> {
 
    }).catch(function(error) {
      alert(error)
    });
  
  }
  else{
    this.toastr.errorToastr("the two password not equal")

  }
  
  }
  
  
  LogIn(){
    

        this.authService.login(this.email,this.pass) 
      

  }

  send_Password_ResetEmail(){
  
    this.authService.sendPasswordResetEmail(this.EmailResetPassword)
    
    .catch((error) => {
      if(error.code){
       this.toastr.warningToastr(error.message)
       
     }
   });
   setTimeout(() => {
    this.EmailResetPassword = null
      
  }, 1000);


  }




}
