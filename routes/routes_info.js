const express = require('express');
const { Router } = express;
const { fork } = require('child_process');

const router = new Router();

router.get('/info',(req, res, next) =>{
    res.status(200).json({
        message: 'Datos',
        elementos: {
            args: process.argv,
            platform: process.platform,
            version: process.version,
            path: process.execPath,
            id: process.pid,
            folder: process.cwd(),
            rss: process.memoryUsage().rss,
        }
    });
});

router.get('/api/randoms',(req, res, next) =>{
    let random = req.query.cant === undefined ? 1e9 : req.query.cant;
    //probando con 5e9
    // let random = 5e9;
    // console.log(process.cwd());
    const forkeando = fork(process.cwd()+'/randoms/randomFork');
    forkeando.send(random);
    forkeando.on('message', (result) => {
        if (result > 0) {
            res.send('La sumatoria total fué '+ result)
        }
    }) 
});


router.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = router;