import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { RouterLink, RouterLinkActive } from '../../node_modules/@angular/router/index';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent,SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
}
