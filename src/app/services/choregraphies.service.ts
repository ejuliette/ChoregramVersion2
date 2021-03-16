import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Choregraphie } from '../models/choregraphie.model';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ChoregraphiesService {

  choregraphies: Choregraphie[] = [];
  choregraphiesSubject = new Subject<Choregraphie[]>();

  constructor() { }

  emitChoregraphies() {
    this.choregraphiesSubject.next(this.choregraphies);
  }

  saveChoregraphies(){
    firebase.database().ref('/choregraphies').set(this.choregraphies);
  }

  getChoregraphies(){
    firebase.database().ref('/choregraphies')
    .on('value',(data) => {
      this.choregraphies=data.val() ? data.val(): [];
      this.emitChoregraphies();
    });
  }

  getSingleChoregraphie(id: number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/choregraphies/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }


  createNewChoregraphie(newChoregraphie: Choregraphie) {
    this.choregraphies.push(newChoregraphie);
    this.saveChoregraphies();
    this.emitChoregraphies();
  }

  removeChoregraphie(choregraphie : Choregraphie){
    const choregraphieIndexToRemove = this.choregraphies.findIndex(
      (choregraphieEl) => {
        if(choregraphieEl === choregraphie){
          return true;
        }
      }
    );
    this.choregraphies.splice(choregraphieIndexToRemove, 1);
    this.saveChoregraphies();
    this.emitChoregraphies();
  }


}
