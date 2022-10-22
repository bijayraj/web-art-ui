import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  public displayedColumns = ['id', 'username', 'firstName', 'lastName', 'role', 'created_at', 'actions'];
  public dataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private userService: UserService,
    public dialog: MatDialog,
    private router: Router) { }

  loadUsers() {
    this.userService.getAll().subscribe(data => {
      this.dataSource.data = data as User[];
      // console.log(data);
    });
  }
  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  redirectToDetails(id: number) {
    this.router.navigate(['users', id]);
  }

  deleteArtwork(id: number, title: string): void {
    const message = `Are you sure you want to delete "${title}"?`;

    const dialogData = new ConfirmDialogModel("Delete?", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userService.delete(id).subscribe((data: any) => {
          console.log(data);
          this.loadUsers();
        });
      }
    });
  }

  addUser() {
    this.router.navigate(['users', 0]);
  }



  public doFilter = (target: any) => {
    let htmlTarget = target as HTMLInputElement;
    this.dataSource.filter = htmlTarget.value.trim().toLocaleLowerCase();
  }


}
