import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'delete'];
  userTab: PeriodicElement[];
  dataSource = new MatTableDataSource<PeriodicElement>();
  isLoggedIn = false;
  isAdmin = false;
  error = '';
  currentUser: User = {
    id: 0
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService,
    private router: Router,
    private tokenStorageService: TokenStorageService) { }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.currentUser = this.tokenStorageService.getUser();
    this.isAdmin = this.tokenStorageService.getUser().isAdmin;
    this.getAllUser();
  }

  convertUsertoUserTab(user: User): PeriodicElement {

    var userRetour: PeriodicElement = {
      id: user.id ? user.id : 0,
      nom: user.nom ? user.nom : '',
      prenom: user.prenom ? user.prenom : '',
      email: user.email ? user.email : ''
    }
    return userRetour;
  }

  convertAllUsertoUserTab(users: User[]): PeriodicElement[] {

    let usersRetour: Array<PeriodicElement> = [];

    users.forEach(element => {
      if (element.id == this.currentUser.id) return;
      usersRetour.push(this.convertUsertoUserTab(element));

    });


    return usersRetour;
  }

  getAllUser(): void {
    this.userService.getAllUser()
      .subscribe(
        response => {
          this.userTab = this.convertAllUsertoUserTab(response);
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.userTab);
        },
        error => {
          this.error = error;
        });
  }

  deleteUser(idUser: number): void {
    this.userService.deleteUser(idUser)
      .subscribe(
        response => {
          this.redirectAdmin();
        },
        error => {
          this.error = error;
        });
  }

  redirectAdmin(): void {
    (async () => {
      window.location.href = "/admin";

    })();
  }

}



export interface PeriodicElement {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}


