import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { catchError, timeout, map, finalize } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Fileupload } from '../Models/fileupload.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user
  private basePath = '/usrsImages';
  private basePathchats = '/chatsImages';
  AddUrl
  AddUrlchat
  constructor(public  afAuth:  AngularFireAuth, private firestore: AngularFirestore,public  router:  Router, public toastr: ToastrManager,private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  async register(email: string, password: string , username) {
   
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
      
      // console.log(credential.user)
      this.sendEmailVerification();
      this.Add_InfoUser(email, password , username)
      this.toastr.successToastr("User Created")
    })
    
  }
  async sendEmailVerification() {
    await (await this.afAuth.currentUser).sendEmailVerification()
  }
  Add_InfoUser(SignInMail,SignInpassword,UserName){
      
    var body = { 
        "mail":SignInMail,
        "password":SignInpassword,
        "name":UserName,
        "url":null,
        "type":"client",
   
    }
    
    return this.firestore.collection('Users').add(body);
  
  }
  VerificationLogIn(){
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        // console.log(this.user )
        localStorage.setItem('user', JSON.stringify(this.user));
        // console.log(this.user)
        // console.log(this.user.emailVerified)
        localStorage.setItem('UserLogMail', this.user.email);
        // localStorage.setItem('',this.user.emailVerified);
      } else {
        localStorage.setItem('user', null);
      }
    })
    
  }

  async login(email: string, password: string) {
    var result = await this.afAuth.signInWithEmailAndPassword(email, password).then(res => {

          this.VerificationLogIn()
          this.IsLoggedIn()
          this.toastr.successToastr("You Log")
      
      localStorage.setItem('mail', JSON.stringify(res.user.email));
      setTimeout(() => {
        this.router.navigate(['chatroom'])
        
      }, 500);
   
 
    })
    .catch(error => {
      this.toastr.warningToastr("E-MAIL OR PASSWORD NOT CORRECT")
    });
    // this.VerificationLogIn()
    //   this.toastr.successToastr("LogIn")
    //   localStorage.setItem('mail', JSON.stringify(result.user.email));
    
   
    
}
IsLoggedIn(): boolean {

  const  user  =  localStorage.getItem('user')

  if(user==null){
    return false;
    
    
  }
  else{
    return true;
  }
}
async log_out(){


  await this.afAuth.signOut();
  
  localStorage.removeItem('user');
  localStorage.removeItem('mail');
  localStorage.removeItem("UserLogMail")
  localStorage.removeItem("iduser")
  localStorage.removeItem("Nameuser")
  localStorage.removeItem("ProfilePhotoUser")
  localStorage.removeItem("UserPassword")
  localStorage.removeItem("typeuser")
  this.IsLoggedIn()
  console.log(this.IsLoggedIn())

  this.toastr.successToastr("LogOut")
  setTimeout(() => {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    
  }, 500);

  this.router.navigate([''])


 

  // this.router.navigate(['admin/login']);
}
async sendPasswordResetEmail(passwordResetEmail: string) {
  // console.log(this.afAuth.sendPasswordResetEmail(passwordResetEmail))
  

  return await this.afAuth.sendPasswordResetEmail(passwordResetEmail).then(fun=>{
    this.toastr.successToastr("Check Massage Send To Your E-Mail")

  }) 
}


get_Users() {
  return this.firestore.collection('Users').snapshotChanges();
}

update_profilePhoto(id)
{


  this.firestore.collection('Users').doc(id).update({url: this.AddUrl});
  this.toastr.successToastr("Changed")
  setTimeout(() => {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    
  }, 1000);

  
 }  
 Add_Img_user(fileUpload: Fileupload): Observable<number> {
  const filePath = `${this.basePath}/${fileUpload.file.name}`;
  const storageRef = this.storage.ref(filePath);
  const uploadTask = this.storage.upload(filePath, fileUpload.file);

  uploadTask.snapshotChanges().pipe(
    finalize(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        this.AddUrl = downloadURL;
        // console.log('File available at', downloadURL);
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileData(fileUpload);
        this.update_profilePhoto(localStorage.getItem("iduser"))

        
        
      });
    })
  ).subscribe();


  return uploadTask.percentageChanges()

}
private saveFileData(fileUpload: Fileupload) {
  this.db.list(this.basePath).push(fileUpload);
}



delete_Img(fileUpload: Fileupload) {
  this.deleteFileDatabase(fileUpload.key)
    .then(() => {
      this.deleteFileStorage(fileUpload.name);
    })
    .catch(error => this.toastr.warningToastr("TRY IN ANOTHER TIME"));
}
private deleteFileDatabase(key: string) {
  return this.db.list(this.basePath).remove(key);
}

private deleteFileStorage(name: string) {
  const storageRef = this.storage.ref(this.basePath);
  storageRef.child(name).delete();
}
get_Img(numberItems): AngularFireList<Fileupload> {
  return this.db.list(this.basePath, ref =>
    ref.limitToLast(numberItems));
    
}
update_UserName(user,id)
{

  this.firestore.collection('Users').doc(id).update({name: user});
  this.toastr.successToastr("Changed")

  setTimeout(() => {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    
  }, 1000);
  
 }
//  get isLoggedIn(): boolean {
//   const  user  =  localStorage.getItem('user')

//   if(user!=null){
//     return true;
//   }
//   else{
//     return false;
//   }
  
// }
get_chats() {
  return this.firestore.collection('chats').snapshotChanges();
}
Add_chats(chat,img){
      
  var body = { 
      "chat":chat,
      "urlimg":localStorage.getItem("ProfilePhotoUser"),
      "date":new Date(),
      "mail":localStorage.getItem("mail"),
      "username":localStorage.getItem("Nameuser"),
      "img":img
 
  }
  
  return this.firestore.collection('chats').add(body);

}
Add_Img_chats(fileUpload: Fileupload,chats): Observable<number> {
  var x = Math.floor((Math.random() * 1000000000) + 1);
  const filePath = `${this.basePathchats + x }/${fileUpload.file.name}`;
  const storageRef = this.storage.ref(filePath);
  const uploadTask = this.storage.upload(filePath, fileUpload.file);

  uploadTask.snapshotChanges().pipe(
    finalize(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        this.AddUrlchat = downloadURL;
        // console.log('File available at', downloadURL);
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileDatachats(fileUpload);
        this.Add_chats(chats,downloadURL )
        
        
      });
    })
  ).subscribe();


  return uploadTask.percentageChanges()

}
private saveFileDatachats(fileUpload: Fileupload) {
  this.db.list(this.basePathchats).push(fileUpload);
}
getFileUploads(numberItems): AngularFireList<Fileupload> {
  return this.db.list(this.basePathchats, ref =>
    ref.limitToLast(1000));
}
update_photochatsuser(userurl,id)
{

  this.firestore.collection('chats').doc(id).update({urlimg: userurl});
  

  // setTimeout(() => {
  //   if (!localStorage.getItem('foo')) { 
  //     localStorage.setItem('foo', 'no reload') 
  //     location.reload() 
  //   } else {
  //     localStorage.removeItem('foo') 
  //   }
    
  // }, 1000);
  
 }
 Delete_message(id: string){
  this.firestore.doc('chats/' + id).delete();
}
}
