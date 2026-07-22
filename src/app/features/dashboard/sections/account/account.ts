import { Component, inject } from '@angular/core';
import { DataService } from '../../../../core/data.service';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private data = inject(DataService);
  protected usuario = this.data.usuario;
  protected bases = this.data.bases;
}