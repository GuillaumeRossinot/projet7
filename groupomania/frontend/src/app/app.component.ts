import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isLoggedIn = false;
  showAdminBoard = false;
  isAdmin = false;
  email?: string;
  nom?: string;
  prenom?: string;
  title = 'Groupomania';

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.isAdmin = this.tokenStorageService.getUser().isAdmin;

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();

      this.showAdminBoard = user.isAdmin;

      this.email = user.email;
      this.nom = user.nom;
      this.prenom = user.prenom;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
