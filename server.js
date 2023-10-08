const allEmployees = require("./data/employees.json");

const express = require('express');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 8000;

const Ajv = require("ajv")
const ajv = new Ajv()

const employeeSchema = {
    type: "object",
    properties: {
        name: {type : "string"},
        age: {type : "integer"},
        phone: {type : "object"},
        privileges: {type : "string"},
        favorites: {type : "object"},
        finished: {type : "array", items: {type: "integer"}},
        badges: {type : "array", items: {type: "string"}},
        points: {type : "array", items: {type: "object"}},
    },
    required: ["name", "age", "phone", "privileges", "favorites",
                "finished", "badges", "points"]
}

// App
const app = express();

app.use(bodyParser.json()); // for parsing application/json

// Puntos 1, 2, 3, 5, 7
app.get('/api/employees', (request, response, next) => {
    let dataResponse = [];
    let page = request.query.page;
    let user = request.query.user;
    let badges = request.query.badges;
    if(page){
        dataResponse = allEmployees.slice(2*(page-1), (2*(page-1))+2);        
    } else if(user){
        dataResponse = allEmployees.filter(o => o.privileges === 'user');
    } else if(badges){
        dataResponse = allEmployees.filter(o => o.badges.includes(badges));
    } else {
        dataResponse = allEmployees;
    }
    response.send(dataResponse);
});

// Punto 4
app.get('/api/employees/oldest', (request, response, next) => {
    var max = 0;
    var oldest = allEmployees.reduce((acc, p) => {
        max = Math.max(max, p.age);
        acc[p.age] = acc[p.age] || [];
        acc[p.age].push(p);
        return acc;
    }, {});
    response.send(oldest[max]);
});

// Punto 6
app.post('/api/employees', async function (req, res) {
    const employee = req.body;
    const valid = ajv.validate(employeeSchema, employee);
    // si tiene el mismo formato, agregar al array
    if(valid){
        allEmployees.push(employee);
        res.status(200).send({mensaje: "Operación exitosa"});
    }else {
        let error = {code:"bad_request"}
        res.status(400).send(error);
    }    
});

// Punto 8
app.get('/api/employees/:name', (request, response, next) => {
    var name = request.params.name;
    let employee = allEmployees.filter(o => o.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    if(employee.length > 0){
        response.status(200).send(employee[0]);
    }else {
        let error = {code:"not_found"}
        response.status(404).send(error);
    } 
});

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);

const request = require('supertest');
const assert = require('assert');

// Test Punto 1
request(app)
.get('/api/employees')
.expect('Content-Type', /json/)
.expect(200)
.end(function(err, res) {
    if(JSON.parse(res.text).length == 6) console.log("* Test Punto 1: Exitoso");
  if (err) throw err;
});

// Test Punto 2
request(app)
.get('/api/employees?page=1')
.expect('Content-Type', /json/)
.expect(200)
.end(function(err, res) {
    if(JSON.parse(res.text).length == 2) console.log("** Test Punto 2: Exitoso");
  if (err) throw err;
});

// Test Punto 3
request(app)
.get('/api/employees?page=2')
.expect('Content-Type', /json/)
.expect(200)
.end(function(err, res) {
    if(JSON.parse(res.text).length == 2) console.log("*** Test Punto 3: Exitoso");
  if (err) throw err;
});

// Test Punto 4
request(app)
.get('/api/employees/oldest')
.expect('Content-Type', /json/)
.expect(200)
.end(function(err, res) {
    let age = JSON.parse(res.text)[0].age;
    if( age == 43) console.log("**** Test Punto 4: Exitoso ");
  if (err) throw err;
});

// Test Punto 5
request(app)
.get('/api/employees?user=true')
.expect('Content-Type', /json/)
.expect(200)
.end(function(err, res) {
    if(JSON.parse(res.text).length == 4) console.log("***** Test Punto 5: Exitoso");
  if (err) throw err;
});

// Test Punto 6
request(app)
.post('/api/employees')
.expect('Content-Type', /json/)
.expect(400)
.send({url: 'www.google.com'})
.end(function(err, res) {
    if(JSON.parse(res.text).code == 'bad_request') console.log("****** Test Punto 6: Exitoso");
  if (err) throw err;
});

// Test Punto 7
request(app)
.get('/api/employees?badges=black')
.expect('Content-Type', /json/)
.expect(200)
.send({url: 'www.google.com'})
.end(function(err, res) {
    if(JSON.parse(res.text).length == 3) console.log("******* Test Punto 7: Exitoso");
  if (err) throw err;
});

// Test Punto 8
request(app)
.get('/api/employees/noExiste')
.expect('Content-Type', /json/)
.expect(404)
.send({url: 'www.google.com'})
.end(function(err, res) {
    if(JSON.parse(res.text).code == 'not_found') console.log("******** Test Punto 8: Exitoso");
  if (err) throw err;
});