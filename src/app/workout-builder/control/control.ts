import {Component, input} from '@angular/core';
import {Block} from '../block';

@Component({
  selector: 'app-control',
  imports: [],
  templateUrl: './control.html',
  styleUrl: './control.scss'
})
export class Control {
  block = input<Block>();
}
