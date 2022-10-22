import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { ArtworkApproval } from '../models/artwork-approval';
import { ArtworkApprovalService } from '../services/artwork-approval.service';
import { Artwork } from '../models/artwork';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  approvals: ArtworkApproval[] = [];
  resolved: boolean = false;

  public displayedColumns = ['id', 'artworkId', 'artworkTitle', 'userId', 'username', 'created_at', 'actions'];
  public dataSource = new MatTableDataSource<ArtworkApproval>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private approvalService: ArtworkApprovalService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.loadApprovals();
  }

  loadApprovals() {
    if (this.resolved) {
      this.approvalService.getResolved().subscribe(data => {
        console.log(data);
        this.dataSource.data = data as ArtworkApproval[];
      });
    } else {
      this.approvalService.getUnresolved().subscribe(data => {
        console.log(data);
        this.dataSource.data = data as ArtworkApproval[];
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  redirectToDetails(id: number) {
    this.router.navigate(['edit', id]);
  }


  public doFilter = (target: any) => {
    let htmlTarget = target as HTMLInputElement;
    this.dataSource.filter = htmlTarget.value.trim().toLocaleLowerCase();
  }

}
