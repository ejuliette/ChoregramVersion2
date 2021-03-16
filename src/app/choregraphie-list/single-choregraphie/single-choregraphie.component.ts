import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Choregraphie } from 'src/app/models/choregraphie.model';
import { ChoregraphiesService } from 'src/app/services/choregraphies.service';

@Component({
  selector: 'app-single-choregraphie',
  templateUrl: './single-choregraphie.component.html',
  styleUrls: ['./single-choregraphie.component.css']
})
export class SingleChoregraphieComponent implements OnInit {

  choregraphie : Choregraphie;

  constructor(private route: ActivatedRoute,
              private choregraphiesService: ChoregraphiesService,
              private router: Router) { }

  ngOnInit(): void {
    this.choregraphie = new Choregraphie('','');
    const id = this.route.snapshot.params['id'];
    this.choregraphiesService.getSingleChoregraphie(+id).then(
      (choregraphie : Choregraphie) => {
        this.choregraphie = choregraphie;
      }
    );
  }

  onBack(){
    this.router.navigate(['/choregraphies']);

  }

}
