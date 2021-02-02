import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { map } from 'rxjs/operators';
import { Fileupload } from '../Models/fileupload.model';
import { AuthService } from '../service/auth.service';



@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})

export class ChatroomComponent implements OnInit {
 
  checklog  
  DataUsers
  Username
  UserUrl
  mail
  selectedFiles: FileList;
  percentage: number;
  currentFileUpload: Fileupload;
  fileUploads: any[];
  
  public load = true
  ChangeUserName
  /////////chat///////
  chat = null
 
  img = null
  //////////////////getchats///////////////
  dataChats = []
  maillog
  dateget
  dateshow= {"num":0,"char":""}
  fileUploadschats: any[];
  idmessagee



  constructor(private  authService:  AuthService , public toastr: ToastrManager,public  router:  Router) {
    

   }
 

  ngOnInit(): void {
    this.checklog=this.authService.IsLoggedIn()
    this.maillog=JSON.stringify(localStorage.getItem("UserLogMail"))
    if(localStorage.getItem("user") == null || localStorage.getItem("user") == 'null' ){
      this.router.navigate([""]);
    }

    
    // console.log(this.checklog)
    // console.log(localStorage.getItem("user"))
    this.GetUsers()
    this.Getchats()
    
    this.getimge()
    setTimeout(() => {
      window.scrollTo(0,document.body.scrollHeight);
      
    }, 1000);
    

   

    
   
  }


  logout(){
    this.authService.log_out()
    
  }

  GetUsers()
   {
     this.authService.get_Users().subscribe(res=>
       {
         this.DataUsers = res.map(e => {
           return {
             
             id: e.payload.doc.id,
             ...e.payload.doc.data() as []
             
           } 

   
     
         })
 
         
        //  console.log(this.DataUsers)
        
         for (let i = 0; i < this.DataUsers.length; i++) 
         {
   
           if (this.DataUsers[i].mail == localStorage.getItem("UserLogMail"))
           {
             this.Username = this.DataUsers[i].name
             this.UserUrl = this.DataUsers[i].url
             this.mail= this.DataUsers[i].mail
             localStorage.setItem("iduser",this.DataUsers[i].id)
             localStorage.setItem("Nameuser",this.DataUsers[i].name)
             localStorage.setItem("ProfilePhotoUser",this.DataUsers[i].url)
             localStorage.setItem("UserPassword",this.DataUsers[i].password)
             localStorage.setItem("typeuser",this.DataUsers[i].type)



      



 
           }
           
         }
       
        
         
       },
       err=>
       {
         this.toastr.errorToastr(err.message)
       })
   }
   
   DeleteProfileImg() {

    console.log(this.fileUploads)
    console.log(localStorage.getItem("ProfilePhotoUser"))
   
    if(localStorage.getItem("ProfilePhotoUser") != "null"){
      console.log("3")
      for (let i = 0; i < this.fileUploads.length; i++) {
        console.log(this.fileUploads[i].url)
        if(this.fileUploads[i].url==localStorage.getItem("ProfilePhotoUser") ){
          console.log(this.fileUploads[i])
          this.DeleteImg(this.fileUploads[i])

          

        }
        
      }
      
    }
    else{
      console.log("3")
      this.AddProfileImg()

        
    }
 
  
  }
  DeleteImg(fileUpload) {
    this.authService.delete_Img(fileUpload);
    this.AddProfileImg()
    console.log("3")
  }
   SelectImg(event) {
    this.selectedFiles = event.target.files;
    console.log("2")
  }
   AddProfileImg(){
    const file = this.selectedFiles.item(0);
  this.selectedFiles = undefined;
  this.currentFileUpload = new Fileupload(file);
  
  
 this.authService.Add_Img_user(this.currentFileUpload).subscribe(
    percentage => {
      this.percentage = Math.round(percentage);
      if(this.percentage==100){
        
        console.log("4")
        
          // setTimeout(() => {
          //   // this.load = false
          //   document.getElementById("closemodel").click()
            
          // }, 15000); 
          setTimeout(() => {
            
            document.getElementById("closemodel").click()
            
          }, 3000);

        
      }
      

    },
    error => {
      console.log(error);
    }
    
    
  );
  
  
  }


  GetImage(){
    this.authService.get_Img(100).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      console.log(fileUploads)
      
    
      
    });
    
    console.log("1")
  
  }
  
  updateUserName(){
    this.authService.update_UserName(this.ChangeUserName, localStorage.getItem("iduser"))
    
  }
  addchat(){
    this.authService.Add_chats(this.chat,this.img).then(()=> {
      this.chat = null
      setTimeout(() => {
        this. Getchats()
      }, 1000);
      
      window.scrollTo(0,document.body.scrollHeight);


      

 
    }).catch(function(error) {
      alert(error)
    });
  }


   Getchats()
   {
     this.authService.get_chats().subscribe(res=>
       {
         this.dataChats = res.map(e => {
           return {
             
             id: e.payload.doc.id,
             ...e.payload.doc.data() as []
             
           } 

   
     
         })
       
          this.dataChats.sort((a, b) => b.date - a.date)
          this.dataChats.reverse();
      
        
         
         for (let i = 0; i < this.dataChats.length; i++){
           if(this.dataChats[i].mail == JSON.stringify(localStorage.getItem("UserLogMail"))){            
              this.authService.update_photochatsuser(this.UserUrl,this.dataChats[i].id )
              
           }
    
         
          
  
          this.dateget= this.dataChats[i].date.toDate()
  
          var date1 = new Date();
             var finaldate = date1.getTime() - this.dateget.getTime()
             
             if(finaldate/1000>1)
            {
               var s = finaldate/1000
               this.dateshow.num=s
               this.dateshow.char="s"
  
               if(s/60>1)
              {
                
                var m = s/60
                this.dateshow.num=m
               this.dateshow.char="m"
                if(m/60>1)
                {
                  var h = m/60
                  this.dateshow.num=h
                  this.dateshow.char="h"
                  if(h/24>1)
                  {
                    var d = h/24
                    this.dateshow.num=d
                    this.dateshow.char="d"
                    if(d/7>1)
                    {
                      var w = d/7
                      this.dateshow.num=w
                      this.dateshow.char="w"
                      if(w/4>1)
                    {
                        var month = w/4
                        this.dateshow.num=month
                      this.dateshow.char="month"
                      if(month/12>1)
                      {
                        var y = month/12
                        this.dateshow.num=y
                        this.dateshow.char="y"
                      }
  
                      
  
                      }
                    }
                   
      
                  }
    
                }
              }
             
  
           }
           
           this.dateshow.num = Math.floor(this.dateshow.num)
           this.dataChats[i].date = {num:this.dateshow.num,char:this.dateshow.char }
         
          
           
  
          
        }
 
         
        //  console.log(this.dataChats)
        
   
         
       },
       err=>
       {
         this.toastr.errorToastr(err.message)
       })
   }
   AddImgchats(){
    const file = this.selectedFiles.item(0);
  this.selectedFiles = undefined;
  this.currentFileUpload = new Fileupload(file);
  
  
 this.authService.Add_Img_chats(this.currentFileUpload,this.chat).subscribe(
    percentage => {
      this.percentage = Math.round(percentage);
      if(percentage==100){
        console.log("4")
        
          setTimeout(() => {
            this.load = false
            
          }, 15000); 
          setTimeout(() => {
            
            document.getElementById("closemodel2").click()

            this. Getchats()

            this.chat = null
            window.scrollTo(0,document.body.scrollHeight);
            
          }, 1000);

        
      }
      

    },
    error => {
      console.log(error);
    }
    
    
  );
  
  
  }
  getimge(){
  
    this.authService.getFileUploads(6).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploadschats = fileUploads;
      
      // console.log(this.fileUploadschats)
    });
   
  }

 deleteMessage(){
   this.authService.Delete_message(this.idmessagee)
   this.Getchats()

   
 }
 idmessage(id){
this.idmessagee=id


 }


}
