import { Component, input, output } from '@angular/core';
import { FitEncoder } from '../fit-encoder';
import { MatButton } from '@angular/material/button';
import { Block } from '../workout-builder/block';
import { MatIcon } from '@angular/material/icon';
import FitDecoder from '../fit-decoder';

@Component({
  selector: 'app-fit-control',
  imports: [MatButton, MatIcon],
  templateUrl: './fit-control.html',
  styleUrl: './fit-control.scss',
})
export class FitControl {
  currentWorkout = input<Block[]>([]);
  importWorkout = output<Block[]>();

  download(): void {
    const fitEncode: FitEncoder = new FitEncoder();
    const fitFile: Uint8Array<ArrayBufferLike> = fitEncode.encode(this.currentWorkout());
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

  async onFileSelected(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement | null;
    const file = inputEl?.files && inputEl.files.length > 0 ? inputEl.files[0] : undefined;
    if (!file) return;
    try {
      const name = file.name.toLowerCase();
      if (!name.endsWith('.fit')) {
        console.warn('Unsupported file type:', name);
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blocks = FitDecoder.decode(bytes);
      this.importWorkout.emit(blocks);
    } catch (e) {
      console.error('Failed to decode FIT file:', e);
    } finally {
      if (inputEl) inputEl.value = '';
    }
  }
}
