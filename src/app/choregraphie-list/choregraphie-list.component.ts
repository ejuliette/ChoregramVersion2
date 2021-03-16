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

  ngOnInit(): void {
    this.choregraphiesSubscription = this.choregraphiesService.choregraphiesSubject.subscribe(
      (choregraphies: Choregraphie[]) => {
        this.choregraphies = choregraphies;
      }
    );
    this.choregraphiesService.getChoregraphies();
    this.choregraphiesService.emitChoregraphies();
  }

  onNewChoregraphie(){
    this.router.navigate(['/choregraphies','new']);
  }

  onDeleteChoregraphie(choregraphie : Choregraphie){
    this.choregraphiesService.removeChoregraphie(choregraphie);
  }

  onViewChoregraphie(id:number){
    this.router.navigate(['/choregraphies','view',id]);
  }

  ngOnDestroy(){
    this.choregraphiesSubscription.unsubscribe();

  }

}
