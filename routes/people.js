const express = require('express');
const peopleRouter = express.Router();
const people = require('../People');
const ibmdb = require('ibm_db');
const connStr = 'DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-10.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dkj72707;PWD=48bp@tj78n3pzwxd;';

const idFilter = req => member => member.id === parseInt(req.params.dni);

// Obtiene todas las personas
peopleRouter.get('/', (req, res) => {
    ibmdb.open(connStr, function(err, conn) {
        //var sql = 'select 1 from sysibm.sysdummy1;';
        var sql = 'select * from Persona'
        conn.query(sql, function(err, data) {
            //console.log(data);
            res.render('index-people', {
                title: 'Personas',
                people: data,
            })
        });

    });
});

// Nueva perosna
peopleRouter.get('/create', (req, res) => {
    res.render('create-people', {
        title: 'Nueva Persona',
    })
});

peopleRouter.post('/', (req, res) => {
    ibmdb.open(connStr, function(err, conn) {
        var sql = 'insert into Persona values (?, ?, ?, ?, ?)';
        var params = [
            parseInt(req.body.PEINDO),
            req.body.PENYAP,
            req.body.PEMAIL,
            parseInt(req.body.PEFNAC),
            1
        ];
        console.log(params);
        conn.prepare(sql, function(err, stmt) {
            stmt.execute(params, function(err, result) {
                res.redirect('/personas');
            });
        });
    });
});

// Actualiza persona
peopleRouter.get('/edit/:dni', (req, res) => {
    ibmdb.open(connStr, function(err, conn) {
        var sql = 'select * from Persona where PEINDO = ?';
        var params = [parseInt(req.params.dni)];

        conn.prepare(sql, function(err, stmt) {
            stmt.execute(params, function(err, result) {
                result.fetch(function(err, data) {
                    if (err) console.error(err);
                    console.log(data);
                    res.render('edit-people', {
                        title: 'Editar Persona',
                        person: data
                    })
                });
            });
        });
    });

});

peopleRouter.post('/:dni', (req, res) => {
    ibmdb.open(connStr, function(err, conn) {
        var sql = 'update Persona set PENYAP = ?, PEMAIL = ?, PEFNAC = ? where PEINDO = ?';
        var params = [
            req.body.PENYAP,
            req.body.PEMAIL,
            parseInt(req.body.PEFNAC),
            parseInt(req.params.dni)
        ];
        console.log(params);
        conn.prepare(sql, function(err, stmt) {
            console.error(err);
            stmt.execute(params, function(err, result) {
                console.error(err);
                res.redirect('/personas');
            });
        });
    });
});

// Delete Member
peopleRouter.post('/delete/:dni', (req, res) => {
    ibmdb.open(connStr, function(err, conn) {
        var sql = 'delete Persona where PEINDO = ?';
        var params = [
            parseInt(req.params.dni)
        ];
        console.log(params);
        conn.prepare(sql, function(err, stmt) {
            console.error(err);
            stmt.execute(params, function(err, result) {
                console.error(err);
                res.redirect('/personas');
            });
        });
    });
});

module.exports = peopleRouter;