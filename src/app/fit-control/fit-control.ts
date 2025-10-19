import {Component} from '@angular/core';
import {FitEncoder} from "../fit-encoder";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-fit-control',
    imports: [
        MatButton
    ],
    templateUrl: './fit-control.html',
    styleUrl: './fit-control.scss'
})
export class FitControl {

    download(): void {
        const fitEncode: FitEncoder = new FitEncoder();
        const fitFile: Uint8Array<ArrayBufferLike> = fitEncode.encode();
        const a = document.createElement('a');
        const buffer = fitFile.buffer as ArrayBuffer;
        const objectUrl = URL.createObjectURL(new Blob([buffer], {type: 'application/octet-stream'}));
        a.href = objectUrl;
        a.download = 'file.fit';
        a.click();
        URL.revokeObjectURL(objectUrl);
        console.log('Download button clicked');
        // Add your download logic here
    }

}
