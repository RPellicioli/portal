import { Injectable } from '@angular/core';
import { Moderator } from 'src/app/models/moderator';

@Injectable({
    providedIn: 'root'
})
export class ModeratorService {
    public list: Array<Moderator> = [];

    constructor() {
       
    }

    public push(value: Moderator){
        this.list.push(value);
    }

    public delete(id: number) {
        if(this.list.length == 0) return;

        const index = this.list.findIndex(l => l.id == id);
        this.list.splice(index, 1);
    }
}
