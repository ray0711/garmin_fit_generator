import { Component, input } from '@angular/core';
import { FitEncoder } from '../fit-encoder';
import { MatButton } from '@angular/material/button';
import { Block, BlockLevel, RepeatBlock, WorkoutBlock } from '../workout-builder/block';

@Component({
  selector: 'app-fit-control',
  imports: [MatButton],
  templateUrl: './fit-control.html',
  styleUrl: './fit-control.scss',
})
export class FitControl {
  workout = input<Block[]>([]);

  download(): void {
    const fitEncode: FitEncoder = new FitEncoder();
    const fitFile: Uint8Array<ArrayBufferLike> = fitEncode.encode(this.workout());
    const a = document.createElement('a');
    const buffer = fitFile.buffer as ArrayBuffer;
    const objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }));
    a.href = objectUrl;
    a.download = 'file.fit';
    a.click();
    URL.revokeObjectURL(objectUrl);
    console.log('Download button clicked');
    // Add your download logic here
  }
}
