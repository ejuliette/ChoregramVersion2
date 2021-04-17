import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Choregraphie } from '../models/choregraphie.model';
import { ChoregraphiesService } from '../services/choregraphies.service';

@Component({
  selector: 'app-choregraphie-list',
  templateUrl: './choregraphie-list.component.html',
  styleUrls: ['./choregraphie-list.component.css']
})
export class ChoregraphieListComponent implements OnInit, OnDestroy{

  choregraphies : Choregraphie[];
  choregraphiesSubscription: Subscription;
  constructor(private choregraphiesService: ChoregraphiesService, private router: Router) { }

  //Récupération des chorégraphies à l'iniitalisation de la page
  ngOnInit(): void {
    this.choregraphiesSubscription = this.choregraphiesService.choregraphiesSubject.subscribe(
      (choregraphies: Choregraphie[]) => {
        this.choregraphies = choregraphies;
      }
    );
    this.choregraphiesService.getChoregraphies();
    this.choregraphiesService.emitChoregraphies();
  }

  //Redirection vers la page de création de chorégraphie
  onNewChoregraphie(){
    this.router.navigate(['/choregraphies','new']);
  }

  //Suppression de chorégraphie
  onDeleteChoregraphie(choregraphie : Choregraphie){
    this.choregraphiesService.removeChoregraphie(choregraphie);
  }

  //Redirection vers la page de lecture de chorégraphie
  onViewChoregraphie(id:number){
    this.router.navigate(['/choregraphies','view',id]);
  }

  ngOnDestroy(){
    this.choregraphiesSubscription.unsubscribe();
  }
}
