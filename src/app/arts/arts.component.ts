import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { Artwork } from '../models/artwork';
import { ArtworkService } from '../services/artwork.service';

@Component({
  selector: 'app-arts',
  templateUrl: './arts.component.html',
  styleUrls: ['./arts.component.scss']
})
export class ArtsComponent implements OnInit, AfterViewInit {

  allArts:Artwork[] = [];

  public displayedColumns = ['id', 'title','description', 'created_at', 'actions'];
  public dataSource = new MatTableDataSource<Artwork>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private artService: ArtworkService, public dialog: MatDialog) { }

  loadArts(){
    this.artService.getAll().subscribe(data => {
      this.dataSource.data = data as Artwork[];
      // console.log(data);
    });
  }
  ngOnInit(): void {
    this.loadArts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  redirectToDetails(id:number){

  }

  deleteArtwork(id: number,title:string): void {
    const message = `Are you sure you want to delete "${title}"?`;

    const dialogData = new ConfirmDialogModel("Delete?", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.artService.delete(id).subscribe(data=>{
          console.log(data);
          this.loadArts();
        });
      }
    });
  }
  


  public doFilter = (target:any) => {
    let htmlTarget = target as HTMLInputElement;
    this.dataSource.filter = htmlTarget.value.trim().toLocaleLowerCase();
  }

}
