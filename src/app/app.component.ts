import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-material';
  displayedColumns: string[] = ['productName', 'category', 'freshness', 'date', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog,
    private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    });
  }

  getAllProducts() {
    this.api.getProductList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
      }, error: (err) => {
        alert('');
      }
    })

  }
  editProduct(data: any) {
    console.log(data);
    this.dialog.open(DialogComponent, {
      width: '30%',
      data
    }).afterClosed().subscribe(val => {
      console.log(val);
      if (val === 'update') {
        this.getAllProducts();
      }
    });;

  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        alert('Product deleted succesfully');
        this.getAllProducts();
      }, error: (err) => {
        alert('Error in product deletion');
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
