import { Component, inject } from '@angular/core';
import { DataService } from '../../../../core/data.service';

@Component({
  selector: 'app-logs',
  imports: [],
  templateUrl: './logs.html',
  styleUrl: './logs.scss',
})
export class Logs {
  protected logs = inject(DataService).logs;
}