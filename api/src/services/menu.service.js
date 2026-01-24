
const getAllMenuItemsService = (res, req, next) => {
    return res.status(200).json({
        status: 'success',
        message: 'Fetched all menu items successfully',
        data: [
            { id: 1, name: 'Pizza', price: 10.99 },
            { id: 2, name: 'Burger', price: 8.99 },
            { id: 3, name: 'Salad', price: 5.99 }
        ]
    });
};

export {
    getAllMenuItemsService
};