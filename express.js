const { Pool } = require('pg');
const express = require("express");
const app = express();
app.use(express.json());
const port= 3000;

const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});

require('dotenv').config();

const contrasenaApi = process.env.API_KEY; //GOOD PRACTICE!
// Middleware para verificar la API key
const verificarApiKey = (req, res, next) => {
    const apiKey = req.get('x-api-key'); // Suponiendo que la clave se pasa en el encabezado 'contrasena'

    // Verificar si la clave de API es válida (puedes implementar tu propia lógica aquí)
    if (apiKey === contrasenaApi) {
        next(); // Continuar con la siguiente función en la cadena de middleware
    } else {
        res.status(401).send('Acceso no autorizado');
    }
};
app.use("/students", verificarApiKey);

    
app.get("/students",function(req, res){
    const listUsersQuery = `SELECT * FROM students;`;

pool.query(listUsersQuery)
    .then(res2 => {
        console.log("List students: ", res2.rows);
        res.send(res2.rows)
    })
    .catch(err => {
        console.error(err);
    });
})



    app.get("/students/:id",function(req, res){
        const id =req.params.id
    const listUsersQuery = `SELECT * FROM students WHERE id = ${id};`;

pool.query(listUsersQuery)
    .then(res2 => {
        console.log("List students: ", res2.rows);
        res.send(res2.rows)
    })
    .catch(err => {
        console.error(err);
    });
})

app.post("/students", function(req, res){
    console.log (req.body)
    const query =`INSERT INTO students (id, name, lastname, notes) VALUES('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.note}')`;
    pool.query(query)
    .then(data=>{
    console.log(query);
    return res.send(data)
    })
    console.log(req.body)
})

app.put('/students/:id', function(req, res){
    const modificar = `UPDATE students SET name='${req.body.name}', lastname='${req.body.lastname}', notes='${req.body.notes}'WHERE id='${req.params.id}';`;
    pool.query(modificar)
    .then(data=>{
    console.log(modificar);
    return res.send(data)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send('Hubo un error')

    });
    console.log(req.body)
})

app.delete('/students/:id',function(req,res){
    const eliminar = `DELETE FROM students WHERE id=${req.params.id}`
    pool.query(eliminar)
    .then(data=>{
    console.log(eliminar);
    return res.send(data)
    })
    .catch(err => {
        console.error(err);
        res.status(400)
        res.send('Hubo un error')

    });
    console.log(req.body)
})

app.listen(port,()=>console.log("the app is running"));
    