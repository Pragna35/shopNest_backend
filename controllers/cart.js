const db = require('../db')

const addToCart = (req, res) => {

    const {userId, productId} = req.body

    const checkQuery = `select quantity from cart where user_id = ? AND product_id = ?`
    db.query(checkQuery, [userId, productId], (err, result) => {
      if(err) return res.status(500).json({message:"Error checking product in cart"})

        if(result.length > 0 ){
            //if product exist in cart , updating quantity
            const updateQuery = `update cart set quantity = quantity+1 where  user_id = ? AND product_id = ?`;
            db.query(updateQuery,  [userId, productId], (err,result) => {
               if(err) return res.status(500).json({message:"error updating product quantity"})
                return res.status(200).json({message:"product quantity is updated"})
            })
        }else{
            const insertQuery = `insert into cart (user_id, product_id, quantity) values (?, ?, 1)`;
            db.query(insertQuery, [userId, productId], (err, result) => {
                if(err) return res.status(500).json({message:"Error adding ptoduct to cart"})
                 
                     return res.status(201).json({message:"Product added to cart"})   
            })
        }
    })

}

const getCartItems = (req, res) => {
    const {userId} = req.params

    const query = `select c.product_id, p.product_name, p.price, p.product_img, c.quantity from cart c join products p on c.product_id = p.product_id where c.user_id = ?`
    db.query(query, [userId], (err, result) => {
        if(err) return res.status(500).json({message:"Error getting cart items"})
            return res.status(200).json({items: result, count:result.length})
    })
}

const removeItem = (req, res) => {
const {productId} = req.params;

const removeQuery = `delete from cart where product_id = ?`
db.query(removeQuery, [productId], (err, result) => {
    if(err) return res.status(500).json({message:"error removing product from cart"});

    return res.status(200).json({message:"Product removed successfully."})
})

}

// clearing the cart
const clearCart = (req, res) => {
    const {userId} = req.params
    const clearquery = `delete  from cart where user_id = ?`;

    db.query(clearquery, [userId], (err, result) => {
        if(err) return res.status(500).json({message:"Error clearing cart"});

        return res.status(200).json({message:"Cart cleared successfully"})
    })
}

const increaseQuantity = (req, res) => {
    const {userId, productId} = req.body
const inc_query = `update cart set quantity = quantity+1 where user_id = ? AND product_id = ?`
db.query(inc_query, [userId, productId], (err, result) => {
    if(err) return res.status(500).json({message:"Error increasing quantity"})

        return res.status(200).json({message:"quantity increased successfully."})
})
}

const decreaseQuantity = (req, res) => {
    const {userId, productId} = req.body
    const inc_query = ` DELETE FROM cart WHERE user_id = ? AND product_id = ? AND quantity = 1;
                       update cart set quantity = greatest(quantity-1, 0) where user_id = ? AND product_id = ?`
    db.query(inc_query, [userId, productId, userId, productId], (err, result) => {
        if(err) return res.status(500).json({message:"Error decreasing quantity"})
    
            return res.status(200).json({message:"quantity decreased successfully."})
    })
}

module.exports = {addToCart, getCartItems, clearCart, removeItem, increaseQuantity, decreaseQuantity}