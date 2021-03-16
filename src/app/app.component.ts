import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(){
    var firebaseConfig = {
      apiKey: "AIzaSyDVrVkD7zuZ-slCg2ondtaqi9UNKsKozGg",
      authDomain: "http-client-choregram.firebaseapp.com",
      databaseURL: "https://http-client-choregram-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "http-client-choregram",
      storageBucket: "http-client-choregram.appspot.com",
      messagingSenderId: "298752451248",
      appId: "1:298752451248:web:586eef93c69b33a9ed5175"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
