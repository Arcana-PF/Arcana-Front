export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imgUrl: string;  
    category: string;
    quantity?: number;
}

export interface ICategory{
    id: number;
    name: string;
}
export interface IloginProps{
    email: string;
    password: string;
}
export interface IloginErrors{
    email?: string;
    password?: string;
}

export interface IRegisterProps{
    email: string;
    password: string;
    name: string;
    address: string;
    phone: string;
}
export interface IRegisterErrors{
    email?: string;
    password?: string;
    name?: string;
    address?: string;
    phone?: string;
}

export interface IUserSession {
    token: string;
    user: {
        address: string;
        email: string;
        id: number;
        name: string;
        phone: string;
        orders: IOrder[];
    };
}

export interface IOrder {
    id: number;
    status: string;
    date: Date;
    products: IProduct[];
}