import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {FetchProducts} from '../../providers/fetch-products.service';

import firebase from 'firebase';
import { SendSms } from '../../providers/send-sms';
import {AlertController,  LoadingController} from 'ionic-angular';
import { HomePage} from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartPage } from '../cart/cart';

/*
  Generated class for the Address page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
  providers: [FetchProducts, SendSms]
})
export class AddressPage {
billing_address: any = {};
shipping_address: any = {};
userDetails: any = {};
userSend: any = {};
customerData: any; 
userUID: any;
user: any;
userProfile: any;
public verify:any={};
public verifyStatus:any;
public phoneVerified:boolean=false;
public data:any;
public emailVerified: boolean = false;
loading: any;
public emailID: any;
zone: NgZone;
nZone: NgZone;
customerDescription: any = {};
userProfilium: any;
public signUpForm: FormGroup;
submitAttempt: boolean = false;
billing: any;
shipping: any;
 count: number = 0;
 customerContact: any = {};
  constructor(public formBuilder:FormBuilder,public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
  public alertCtrl:AlertController, public fetchProducts: FetchProducts, public sendSms:SendSms, public loadingCtrl: LoadingController,
  public toastCtrl: ToastController, public modalCtrl: ModalController) 
  {
    
    this.signUpForm=this.formBuilder.group({
          bFirstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          bLastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          bAddress1:['', Validators.compose([Validators.maxLength(70),  Validators.required])],
          bAddress2:['', Validators.compose([Validators.maxLength(70)])],
          bnearestLandmark: ['', Validators.compose([Validators.maxLength(70)])],
          bPinCode:['', Validators.compose([Validators.maxLength(6), Validators.pattern('[0-9 ]*'), Validators.required])],
        //bPhone:['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
          bPhone:['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9 ]*')])],
          bCountry:['India',],
          bState:['Delhi',],
          bCity:['New Delhi',],
          botp: ['',]
}); 
    var that = this;

    if(!firebase.auth().currentUser){

      that.loading = that.loadingCtrl.create({
     
    
      content: 'Not logged in...'
      
    });
    
    that.loading.present();

    setTimeout(() => {
      
     that.navCtrl.setRoot(HomePage);
    }, 1000);

    setTimeout(() => {
      that.loading.dismiss();
    }, 2000);

    }else{


  // this.zone = new NgZone({});
    
      const firebaseConfig = {
      apiKey: "AIzaSyByyA3R_KJMD2LF9G95eu7qM5xGA7evMGc",
      authDomain: "medicinebazaarandroid.firebaseapp.com",
      databaseURL: "https://medicinebazaarandroid.firebaseio.com",
      storageBucket: "medicinebazaarandroid.appspot.com",
      messagingSenderId: "420052832956"
    };    
      firebase.app().delete().then(function() {
    
  firebase.initializeApp(firebaseConfig);
  console.log("Initialised again");
  

    firebase.auth().onAuthStateChanged(function(user) {
      
        if (user) {
         if(that.count < 1){
      //     alert("In email verification");
           that.count++;
           console.log("The value of count is:", that.count);
          // User is signed in and currentUser will no longer return null.
           
          that.storage.get('customerContact').then((details)=>{
      if(details){
        console.log("customerContactTrue", details);
        that.navCtrl.push(CartPage);
      }else{
        console.log("customerContactFalse", details);
           that.user = firebase.auth().currentUser;
           that.userUID = that.user.uid;
          
    // alert("Just before" + that.userUID);
    that.userProfilium = firebase.database().ref('userProfile/' + that.userUID);
          that.userProfilium.on('value', function(snapshot) {
  //   alert("Just after");
        if(!snapshot.val()){
          
          that.emailVerified = that.user.emailVerified;

          console.log("Email verified", that.emailVerified); 
         // alert('emailVerified' + that.user.emailVerified);
              if(!that.user.emailVerified){

      that.loading = that.loadingCtrl.create({
      
    
      content: 'Email not verified. Check your mail...'
      
    });
    
    that.loading.present();

    setTimeout(() => {
     
     that.navCtrl.setRoot(HomePage);
    }, 1000);

     

    setTimeout(() => {
      that.loading.dismiss();
    }, 2000);
    
    console.log("Email is not verified yet!");
    
  }else{
  //  that.storage.set('emailVerified', true);
    //set Email Verified to true;
   //console.log("Email verified storage set to true");
 //  alert("Email is verified");
 }

        }else{


          if(snapshot.val().fbLogin){
          that.emailVerified = true;
          
        }else{
         
        }

        if(snapshot.val().billing && snapshot.val().shipping && snapshot.val().customerDescription){
          that.navCtrl.push(CartPage);
        }else{


        if(!that.emailVerified){

      that.loading = that.loadingCtrl.create({
      
    
      content: 'Email not verified. Check your mail...'
      
    });
    
    that.loading.present();

    setTimeout(() => {
     
     that.navCtrl.setRoot(HomePage);
    }, 1000);

     

    setTimeout(() => {
      that.loading.dismiss();
    }, 2000);
    
    console.log("Email is not verified yet!");
    
  }else{
  //  that.storage.set('emailVerified', true);
    //set Email Verified to true;
   //console.log("Email verified storage set to true");
 }
        }
          
        }

        
                  
          
        });
      }
      });         

          

         }

          
  

        } else {
          console.log("User doesn't exist");
          // No user is signed in.
        }

       
  

});
 
 
});
    that.storage.get('userDetails').then((val)=>{
      that.userDetails = val; 
    });
  }
        }

        elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
}

genSms()
  {
    if(this.signUpForm.valid){
      console.log('valid......;');
      console.log("genSms method..",this.signUpForm.value.bPhone);
    this.sendSms.sendSMS(this.signUpForm.value.bPhone).subscribe(data => {
        this.data = data;
        console.log(this.data);
       
      },
        err => {
        console.log(err);
        this.errorSmsSentAlert();
    },
        () => {
       this.sentSmsAlert();
    });
    }else{
      console.log('not valid......;');
let toast = this.toastCtrl.create({
        message: 'Please fill up all the fields correctly!',
        duration: 2000,
        position: 'bottom'
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        
      });

      toast.present(toast);


    }
    
  }
 
   
  verifyOTP()
  {
    if(this.signUpForm.valid){
      
      this.verify.countryCode="91";
    this.verify.mobileNumber=this.signUpForm.value.bPhone;
    this.verify.oneTimePassword=this.signUpForm.value.botp;
    this.sendSms.verifySms(this.verify).subscribe(verifyStatus => {
        this.verifyStatus = verifyStatus;
        console.log(this.verifyStatus);
        this.phoneVerified=true;  
      },
        err => {
        console.log(err);
        this.phoneVerified=false;
        this.errorAlert();
    },
        () => {
        console.log('Completed');
        
        this.presentAlert();
    });
    }else{
      console.log('not valid......;');
let toast = this.toastCtrl.create({
        message: 'Please fill up all the fields correctly!',
        duration: 2000,
        position: 'bottom'
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        
      });

      toast.present(toast);


    }
    
}
 


//sms sent
 sentSmsAlert()  {
  let alert = this.alertCtrl.create({
    title: 'OTP Sent',
    subTitle: 'OTP sent successfully!',
    buttons: ['Dismiss']
  });
  alert.present();
}

//error while sending
 errorSmsSentAlert()  {
  let alert = this.alertCtrl.create({
    title: 'Error',
    subTitle: 'OTP not sent. Please check your number',
    buttons: ['Dismiss']
  });
  alert.present();
} 

 
//successfully alert verify otp
 presentAlert()  {
  let alert = this.alertCtrl.create({
    title: 'OTP Verify',
    subTitle: 'OTP verified successfully!',
    buttons: ['Dismiss']
  });
  alert.present();
}

//error otp
 errorAlert()  {
  let alert = this.alertCtrl.create({
    title: 'Error',
    subTitle: 'OTP is not verified!',
    buttons: ['Dismiss']
  });
  alert.present();
}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressPage');
  }
  

  signUp(){
if(this.signUpForm.valid){

  if(this.phoneVerified){

    this.submitAttempt=true;
      console.log("signUp function");
console.log("newUser: ", this.signUpForm);
console.log('Billing Address Line 2: ', this.signUpForm.value.bAddress2 + ' Near: ' + this.signUpForm.value.bnearestLandmark);
  this.userSend = {
  "email": this.userDetails.email,
  "password": this.userDetails.password,
  "first_name": this.signUpForm.value.bFirstName,
  "last_name": this.signUpForm.value.bLastName,
  "username": "",
  "billing": {
    "first_name": this.signUpForm.value.bFirstName,
    "last_name": this.signUpForm.value.bLastName,
    "company": "",
    "address_1": this.signUpForm.value.bAddress1,
    "address_2": this.signUpForm.value.bAddress2 + ' Near: ' + this.signUpForm.value.bnearestLandmark,
    "city": this.signUpForm.value.bCity,
    "state": this.signUpForm.value.bState,
    "postcode": this.signUpForm.value.bPinCode,
    "country": this.signUpForm.value.bCountry,
    "email": this.userDetails.email,
    "phone": this.signUpForm.value.bPhone
  },
  "shipping": {
    "first_name": this.signUpForm.value.bFirstName,
    "last_name": this.signUpForm.value.bLastName,
    "company": "",
    "address_1": this.signUpForm.value.bAddress1,
    "address_2": this.signUpForm.value.bAddress2 + ' Near: ' + this.signUpForm.value.bnearestLandmark,
    "city": this.signUpForm.value.bCity,
    "state": this.signUpForm.value.bState,
    "postcode": this.signUpForm.value.bPinCode,
    "country": this.signUpForm.value.bCountry
  }
  }
  console.log("call create User ...");
      this.fetchProducts.createUser(this.userSend).subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.customerData = data;
        console.log(this.customerData);
        this.storage.set('customerID', this.customerData.id);
         //customerId set here
         this.customerContact = {customerContact: this.customerData.billing.phone, customerEmail: this.userDetails.email};
          this.storage.set('customerContact',this.customerContact);
       this.saveToFirebase();
        this.createUserSuccessfull();
      },
        err => {
        console.log(err);
         let alert = this.alertCtrl.create({
      title: 'Login unsuccessfull!',
      subTitle: 'Try with different credentials',
      buttons: ['OK']
    });
    alert.present();

    },
        () => {
        console.log('Completed');
    });
}else{


  let toast = this.toastCtrl.create({
        message: 'OTP is not verified yet!',
        duration: 2000,
        position: 'bottom'
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        
      });

      toast.present(toast);
}
  
}else

{
  let toast = this.toastCtrl.create({
        message: 'Please fill up all the fields',
        duration: 2000,
        position: 'bottom'
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        
      });

      toast.present(toast);


}

}

  

  
  createUserSuccessfull(){
      console.log("Inside createUserSuccessfull", this.customerData.last_order);

      //this.navCtrl.push(CheckoutPage);
      //Logic for this is done in the constructor zone.run method
    }

    saveToFirebase(){

    	this.user = firebase.auth().currentUser;
    	this.userUID = this.user.uid;
      this.emailID = this.user.email;
      this.customerDescription = {email: this.userDetails.email, customerID: this.customerData.id };
      this.billing = {

        first_name: this.signUpForm.value.bFirstName,
    last_name: this.signUpForm.value.bLastName,
    
    address1: this.signUpForm.value.bAddress1,
    address2: this.signUpForm.value.bAddress2 + ' Near: ' + this.signUpForm.value.bnearestLandmark,
    city: this.signUpForm.value.bCity,
    state: this.signUpForm.value.bState,
    postcode: this.signUpForm.value.bPinCode,
    country: this.signUpForm.value.bCountry,
    email: this.userDetails.email,
    phone: this.signUpForm.value.bPhone
      };

      this.shipping = {
        first_name: this.signUpForm.value.bFirstName,
    last_name: this.signUpForm.value.bLastName,
    
    address1: this.signUpForm.value.bAddress1,
    address2: this.signUpForm.value.bAddress2 + ' Near: ' + this.signUpForm.value.bnearestLandmark,
    city: this.signUpForm.value.bCity,
    state: this.signUpForm.value.bState,
    postcode: this.signUpForm.value.bPinCode,
    country: this.signUpForm.value.bCountry
    

      };

      
      console.log(this.emailID);
      console.log(this.customerDescription);
      console.log(this.billing);
      console.log(this.shipping);
      this.userProfile = firebase.database().ref('/userProfile');

       this.userProfile.child(this.userUID).set({customerDescription: this.customerDescription,
        billing: this.billing, shipping: this.shipping});
        console.log("Successfully stored inside the Firebase");
    }
    

    cancel(){
      this.navCtrl.popToRoot();
      console.log("Pop to root");                                                                                                                                                                                                  
    }
}
