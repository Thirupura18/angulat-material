import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList: string[] = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRf: MatDialogRef<DialogComponent>) { }
  actionButton: string = 'Save';

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ["", Validators.required],
      category: ["", Validators.required],
      date: ["", Validators.required],
      freshness: ["", Validators.required],
      price: ["", Validators.required],
      comment: ["", Validators.required]
    });
    if (this.editData)
      this.actionButton = 'Update';
    this.productForm.controls['productName'].setValue(this.editData.productName);
    this.productForm.controls['category'].setValue(this.editData.category);
    this.productForm.controls['date'].setValue(this.editData.date);
    this.productForm.controls['freshness'].setValue(this.editData.freshness);
    this.productForm.controls['price'].setValue(this.editData.price);
    this.productForm.controls['comment'].setValue(this.editData.comment);
  }

  addProduct() {
    console.log(this.productForm.value);
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert('Product added succesfully');
              this.productForm.reset();
              this.dialogRf.close('save');
            },
            error: () => {
              alert('Error while adding product into cart');
            }
          });
      }

    } else {
      this.updateProduct();
    }
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert('Product Updated succesfully');
          this.productForm.reset();
          this.dialogRf.close('update');
        },
        error: () => {
          alert('Error while adding product into cart');
        }
      });
  }

}
