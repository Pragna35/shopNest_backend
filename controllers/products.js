const db = require('../db')

//all products
const getProducts = (req,res) => {
    const q = `select * from products`
db.query(q, (err,result) => {
    if(err) {
    return res.status(500).json({message:"Database error"})
    }

    if(result.length === 0){
        return res.status(404).json({message:"No products found"})
    }
        return res.status(200).json(result)
})

}

//get products by category
const getCategory = (req, res) => {
const category = req.params.category
   if(!category){
    return res.status(400).json({message:"category is required"})
   }

const query = `select * from products where category_name = ?`

db.query(query,[category] ,(err, result) => {
    if(err) res.status(500).send({message:"error fetching data"})

        if(result.length === 0){
            return res.status(404).json({message:`No products found in category: ${category}`})
        }
        res.status(200).send(result)
})
}


module.exports = {getProducts, getCategory};