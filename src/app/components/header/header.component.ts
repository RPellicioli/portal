import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() setType = new EventEmitter<number>();
    
    constructor() { }

    public ngOnInit(): void {
    }

    public select(value: number): void {
        this.setType.emit(value);
    }
}
