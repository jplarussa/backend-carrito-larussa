export const updateQuantityInCartErrorInfo = (cart, productId) => {
    return `One or more properties were sent incomplete or are invalid.
            List of required properties:
            * cartId: type String, received: ${cart}
            * productId: type String, received: ${productId}
            `;
};