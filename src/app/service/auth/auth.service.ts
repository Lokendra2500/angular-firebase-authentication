import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { 
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('userDetails', JSON.stringify(user));
      } else {
        localStorage.setItem('userDetails', null);
      }
    })
  }

  async userLogin(email: string, password: string)  {
    await this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
      console.log('response from login: ', res);
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.log('Error while login: ', err);
    })
  }

  async userRegister(email: string, password: string) {
    await this.afAuth.createUserWithEmailAndPassword(email, password).then((res) => {
      console.log('response from register: ', res);
      
      /**
       * Now, calling sendVerificationMail() function
       * to send the verification email, after successful register.
       */
      this.sendVerificationMail();  

    }).catch((err) => {
      console.log('Error while login: ', err);
    })
  }

  async sendVerificationMail() {
    await this.afAuth.onAuthStateChanged((user) => {
      user?.sendEmailVerification();
    });
  }

  async sendResetPasswordMail(email: string) {
    await this.afAuth.sendPasswordResetEmail(email).then((res) => {
      console.log('We sent you a mail with password reset link, please check your mail inbox.')
    }).catch((err) => {
      console.log('Error while login: ', err);
    })
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('userDetails');
    this.router.navigate(['']);
  }
}
