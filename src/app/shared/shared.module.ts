import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    PaginationComponent,
    MaterialModule
  ]
})
export class SharedModule { }
