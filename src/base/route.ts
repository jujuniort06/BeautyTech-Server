const fs   = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../src/actions');

export class Routes { 

  constructor(){

  }

  registerRoutes(app : any){
        let arquivo = require('../actions/usuario.action');

        // let teste = new arquivo
        console.log(arquivo);

    // fs.readdir(directoryPath, function (err, files) {
    //   files.forEach(function (file : File) {
    //     let arquivo = require('./actions/' + file.toString());

    //     console.log(arquivo)
    //   });
    // });
  }
}