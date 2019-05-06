import { Injectable } from '@angular/core';
import { Moderator } from 'src/app/models/moderator';

@Injectable({
    providedIn: 'root'
})
export class ModeratorService {
    public list: Array<Moderator> = [
        {
            id: 0,
            name: "Ricardo Pellicioli",
            birthday: "2019-04-13",
            age: 26,
            email: "ricardo@goimage.com.br",
            profission: 1,
            initPeriod: '2019-11-03',
            toPeriod: '2019-11-11',
            protocol: "3",
            description: "Teste",
            institutionId: 0
        }
    ];

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
