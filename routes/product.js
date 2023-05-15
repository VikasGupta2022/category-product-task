const express = require('express');
const productrouter = express.Router();
const pool = require('../dbConfig')

// Geting all products

productrouter.get('/allproducts/:pg', async (req, res) => {
  try {
    const {pg} = req.params
    const page = parseInt(pg)
    if(page===1){
     console.log(page)
    const fullData = await pool.query(`SELECT * FROM product WHERE deleted='false' ORDER BY product_id LIMIT 10  OFFSET 0 `) ;
    console.log(fullData.rows)
    res.json(fullData.rows)
   }
   else{
    console.log(page)
    const a = (page*10)-10
    console.log(a)
    const Data = await pool.query(`SELECT * FROM product WHERE deleted='false' ORDER BY product_id LIMIT 9  OFFSET $1 `, [a]);
    console.log(fullData.rows)
    res.json(fullData.rows)
  }
} catch (error) {
    res.status(404).send({status:'error', msg:'Error fetching product from Database', error})
}
});

// Getting  products by ID

productrouter.get('/product/:id', async (req, res) => {
  try {

    const {id} = req.params
    const Data = await pool.query(`SELECT * FROM product WHERE product_id=$1 AND deleted='false'`,
    [id]);
    console.log(Data.rows)
    res.json(Data.rows)
   
} catch (error) {
    res.status(404).send({status:'error', msg:'Error fetching product from Database', error})
}
});


// Creating a new product

productrouter.post('/postProduct', async (req, res) => {
  try{
    const { category_id, product_name} = req.body;
    console.log(category_id, product_name);
    const newDomain = await pool.query(
      `INSERT INTO product ( category_id, product_name,  deleted) 
      VALUES ($1,$2,'false') RETURNING *`,
      [ category_id, product_name]
    );
    console.log("Your data is inserted");
    res.json(newDomain.rows[0]);
  }
  catch (error){
    res.status(500).send({status: 'error', msg: "Error posting data in Databse", error})
  }
  });

  //Updating  products

  productrouter.put('/updateProduct/:id',async(req,res)=>{
    try{
      const { id } = req.params;
    const { product_name } = req.body;
    await pool.query(
      "UPDATE product SET product_name=$1,deleted='false' WHERE product_id = $2",
      [product_name, id]
    );
    console.log("update completed");
    res.json("updated completed");
        }
        catch (error){
              res.status(500).send({status: 'error', msg: "Error updating data in Databse", error})
            
            }
    });

 //Deleting product

  productrouter.put('/deleteProduct/:id',async(req,res)=>{
    try{
      const { id } = req.params;
        await pool.query(`UPDATE product SET deleted=$1 WHERE product_ id = $2 RETURNING * `, ['true', id])
        console.log("data deleted")
        res.json('data deleted')
  }
  catch(error){
    res.status(500).send({status: 'error', msg: "Error deleting data in Database", error})
  }
  });

module.exports = productrouter;
