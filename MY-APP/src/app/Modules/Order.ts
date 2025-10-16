
export class Order {
    userEmail: string;
    items: string;
    total: number;

    constructor(userEmail: string, items: string, total: number) {
        this.userEmail= userEmail;
        this.items= items;
        this.total= total;
    }
}