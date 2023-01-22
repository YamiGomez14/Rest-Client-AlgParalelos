const app = require ('express')();
const PORT=3000;
const cluster = require('node:cluster');
const totalCPUs = require('node:os').cpus().length;
const process = require('node:process');

const axios = require('axios');

if (cluster.isMaster) {
  console.log(`Numeros de CPU ${totalCPUs}`);
  console.log(`Principal ${process.pid} corre`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} muerto`);
    cluster.fork();
  });

} else {
  Inicio();
}

function Inicio() {
axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    console.log(response.data.url);
    console.log(response.data.explanation);
  })
  .catch(error => {
    console.log(error);
  });


app.listen(

    PORT,
    ()=> console.log(`Esta corriendo en el puerto ${PORT}`)

)
}