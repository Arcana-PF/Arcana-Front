export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imgUrl: string;
    isActive: boolean;
    quantity?: number;
    rating?: number;
    categories: {
        id: string;
        name: string;
        isActive: boolean; // Antes era {}, mejor como boolean
        products: string[]; // Antes era [], especificamos tipo como arreglo de strings
    }[];
    onAddToFavorites?: () => void;
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
    validationToken: string;
    token: string;
    user: {
        address: string;
        email: string;
        id: number;
        name: string;
        phone: string;
        orders: IOrder[];
        isAdmin: boolean;
        
    };
    
}

export interface IOrder {
    id: number;
    status: string;
    date: Date;
    products: IProduct[];
}

export interface ICart {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    products: IProduct[];
    totalPrice: number;
}