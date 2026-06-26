import { Component } from '@angular/core';
import { PhoneNumberInputComponent } from "@abs-services/shared/phone-number-input";

@Component({
  selector: 'app-api-logs',
  imports: [PhoneNumberInputComponent],
  templateUrl: './api-logs.html',
  styleUrl: './api-logs.scss',
})
export class ApiLogs {}
