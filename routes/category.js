const express = require('express');
const categoryrouter = express.Router();
const pool = require('../DatabaseConfig')

// Getting all categories

categoryrouter.get('/categories', async (req, res) => {
  try {
    const allData = await pool.query(`SELECT * FROM category WHERE deleted='false' `);
    console.log(allData.rows)
    res.json(allData.rows)
    
  } catch (error) {
      res.status(404).send({status:'error', msg:'Error fetching categories from DB',error})
  }
});

//getting product by categories
categoryrouter.get('/productbycategory/:id', async (req, res) => {
  try {
    const {id}=req.params
    console.log(id)
    const allData = await pool.query(`SELECT * FROM product WHERE category_id=$1 AND deleted='false'`,[id]);
    const categoryData = await pool.query(`SELECT category_name FROM category WHERE category_id=$1 AND deleted='false'`,[id])
    allData.rows.map((x) => {
      x.category_name = categoryData.rows[0].category_name;
    });

    console.log(allData.rows);
    console.log(categoryData.rows);
    res.json(allData.rows);
     
  } catch (error) {
      res.status(404).send({status:'error', msg:'Error fetching categories from DB',error})
  }
});

// Creating a new category

categoryrouter.post('/postCategory', async (req, res) => {
  try{
    const { category_name } = req.body;
    console.log(category_name);
    const newDomain = await pool.query(
      `INSERT INTO category (category_name,deleted) VALUES ($1,'false') RETURNING *`,
      [category_name]
    );
    console.log("inserted");
    res.json(newDomain.rows[0]);
}
catch (error){
  res.status(500).send({status: 'error', msg: "Error posting data in DB", error})
}
});


// Updating a category

categoryrouter.put('/updateCategory/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const { category_name } = req.body;
    await pool.query(
      "UPDATE category SET category_name=$1,deleted='false' WHERE category_id = $2",
      [category_name, id]
    );
    console.log("updated");
    res.json("updated");
}
catch (error){
  res.status(500).send({status: 'error', msg: "Error updating data in DB", error})

}
});

// Deleting a category

categoryrouter.put('/deleteCategory/:id', async (req, res) => {
  try{

    const { id } = req.params;
    await pool.query(`UPDATE category SET deleted=$1 WHERE category_id = $2 RETURNING * `, ['true', id])
    console.log("deleted")
    res.json('deleted')

  }catch(error){
  res.status(500).send({status: 'error', msg: "Error deleting data in DB", error})

  }
});

module.exports = categoryrouter;
