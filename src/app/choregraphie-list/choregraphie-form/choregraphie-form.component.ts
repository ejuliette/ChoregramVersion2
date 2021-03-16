import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ɵangular_packages_platform_browser_platform_browser_j } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Choregraphie } from 'src/app/models/choregraphie.model';
import { ChoregraphiesService } from 'src/app/services/choregraphies.service';

@Component({
  selector: 'app-choregraphie-form',
  templateUrl: './choregraphie-form.component.html',
  styleUrls: ['./choregraphie-form.component.css']
})
export class ChoregraphieFormComponent implements OnInit {

  choregraphieForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private choregraphiesService : ChoregraphiesService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.choregraphieForm = this.formBuilder.group({
      nom: ['',Validators.required],
      choregraphe: ['', Validators.required]
    });
  }

  onSaveChoregraphie(){
    const nom = this.choregraphieForm.get('nom').value;
    const choregraphe = this.choregraphieForm.get('choregraphe').value;
    const newChoregraphie = new Choregraphie(nom, choregraphe);
    this.choregraphiesService.createNewChoregraphie(newChoregraphie);
    this.router.navigate(['/choregraphies']);
  }


}
