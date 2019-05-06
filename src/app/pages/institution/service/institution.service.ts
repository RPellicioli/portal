import { Injectable } from '@angular/core';
import { Institution } from 'src/app/models/institution';

@Injectable({
    providedIn: 'root'
})
export class InstitutionService {
    public list: Array<Institution>;

    constructor() {
        this.list = [
            {
                id: 0,
                name: "Universidade de Caxias do Sul",
                city: 3,
                state: 4,
                street: "Rua Alberto",
                complement: "Ap 123",
                neighbourhood: "Rizzo",
                number: "12",
                zipcode: "123",
                type: 1,
                cnpj: "123456789"
            },
            {
                id: 1,
                name: "Faculdade Pellicioli",
                city: 3,
                state: 3,
                street: "Rua Alberto",
                complement: "Ap 123",
                neighbourhood: "Rizzo",
                number: "12",
                zipcode: "123",
                type: 1,
                cnpj: "123456789"
            }
        ];
    }

    public push(value: Institution){
        this.list.push(value);
    }

    public delete(id: number) {
        if(this.list.length == 0) return;

        const index = this.list.findIndex(l => l.id == id);
        this.list.splice(index, 1);
    }
}
