import { Component } from '@angular/core';

@Component({
  selector: 'app-fit-control',
  imports: [],
  templateUrl: './fit-control.html',
  styleUrl: './fit-control.scss'
})
export class FitControl {

  download(): void {
    console.log('Download button clicked');
    // Add your download logic here
  }

}
