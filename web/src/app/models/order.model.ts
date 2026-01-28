export interface OrderItemRequest {
    id: string; // Menu Item ID
    quantity: number;
}

export interface OrderRequest {
    items: OrderItemRequest[];
    discounts?: {
        available: boolean;
        percentage: number;
    };
}

export interface OrderItemResponse {
    id: string;
    orderId: string;
    itemName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface OrderResponse {
    orderId: string;
    items: OrderItemResponse[];
    totalPrice: number;
    grandTotal: number;
    discounts: any;
}
