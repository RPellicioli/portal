export class Address {
    public zipCode: string;
    public country: Address.Country;
    public city: Address.City;
    public state: Address.State;
    public district: Address.District;
    public addressId: number;
    public address1: string;
    public address2: string;
    public number: string;
}

export namespace Address {
    export class DefaultAddressSegment {
          public id: number;
          public name: string;
    }

    export class Country extends DefaultAddressSegment {
    }

    export class City extends DefaultAddressSegment {
    }

    export class Street extends DefaultAddressSegment {
    }

    export class District extends DefaultAddressSegment {
    }

    export class State extends DefaultAddressSegment {
          public initials: string;
          public ibgeCode: number;
    }

    export class GetParameters {
          public query: string;
          public limit: number;
    }
}