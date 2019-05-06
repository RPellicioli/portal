import { Injectable } from "@angular/core";
import { Address } from "src/app/models/address";
import { ApiBase } from './api-base.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ApiAddressService extends ApiBase {
    protected apiBaseUrl = "https://api2.goimage.com.br/api";
    protected routePath: string = "addresses";

    constructor(
        protected httpClient: HttpClient) {
        super(httpClient);
    }

    public getAddressByZipCode(zipCode: string): Promise<Address> {
        return super.get<Address>(`addressByZipCode/${zipCode}`);
    }

    public getStates(countryId: number): Promise<Array<Address.State>> {
        return super.get<Array<Address.State>>(`countries/${countryId}/states`);
    }

    public getCities(stateId: number): Promise<Array<Address.City>> {
        return super.get<Array<Address.City>>(`states/${stateId}/cities`);
    }
}