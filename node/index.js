const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')
const connection = mysql.createConnection(config)
let createTable = `CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255)
);`

connection.query(createTable);

app.get('/', async (req, res) => {
    const timestamp = new Date().getTime()
    const sql = `INSERT INTO people(nome) values('Arthur ${timestamp}'), ("Full Cycle ${timestamp}"), ("Wesley ${timestamp}");`
    const result = connection.query(sql);

    result.on("error", (err) => {
        console.log("Ops...")
        console.log(err)
    })

    return res.send('<h1>Full Cycle</h1><h1>Acesse <a href="/name">/name</a> para a lista de nomes</h1>')
})

app.get('/name', async (req, res) => {
    const sql = "SELECT nome FROM people ORDER BY id DESC limit 10;"
    const result = connection.query(sql)

    const names = []
    const _promise = new Promise((resolve, reject) => {
        result.on("result", (row) => {
            names.push(`<li>${row.nome}</li>`)
        })
        result.on("end", (_res) => {
            return res.send(`<ul>${names.join("")}</ul>`)
        }).on("error", (err) => {
            resolve("<li>Ops...</li>")
        })
    })

    const response = await _promise;
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})