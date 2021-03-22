import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //currentUser: any;
  isLoggedIn = false;
  isAdmin = false;
  currentUser: User = {
    nom: '',
    prenom: '',
    email: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
  }

  modifyUser(): void {

  }

  deleteUser(): void {
    this.userService.deleteUser(this.currentUser.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/post']);
        },
        error => {
          console.log(error);
        });
  }


}
