import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ChoregraphieListComponent } from './choregraphie-list/choregraphie-list.component';
import { SingleChoregraphieComponent } from './choregraphie-list/single-choregraphie/single-choregraphie.component';
import { ChoregraphieFormComponent } from './choregraphie-list/choregraphie-form/choregraphie-form.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ChoregraphiesService } from './services/choregraphies.service';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {path: 'auth/signup', component: SignupComponent},
  {path: 'auth/signin', component: SigninComponent},
  {path: 'choregraphies', canActivate: [AuthGuardService], component: ChoregraphieListComponent},
  {path: 'choregraphies/new', canActivate: [AuthGuardService], component: ChoregraphieFormComponent},
  {path: 'choregraphies/view/:id', canActivate: [AuthGuardService], component: SingleChoregraphieComponent},
  {path: '', redirectTo:'choregraphies', pathMatch: 'full'},
  {path: '**', redirectTo: 'choregraphies'}
]
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ChoregraphieListComponent,
    SingleChoregraphieComponent,
    ChoregraphieFormComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)

  ],
  providers: [
    AuthService,
    ChoregraphiesService, 
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
