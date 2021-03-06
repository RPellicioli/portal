export class Moderator{
    public id: number;
    public name: string;
    public birthday: string;
    public age: number;
    public institutionId: number;
    public profission: number;
    public email: string;
    public initPeriod: string;
    public toPeriod: string;
    public experience: Array<string> = [];
    public protocol: number;
    public range?: number;
}