const express = require("express");

const server = express();

server.use(express.json());

const cursos = ['Node Js','Java Script','ReactNative'];

//Middleware global
server.use((require,response, next) => {
    console.log(`URL CHAMADA: ${require.url}`);

    return next();
}
);

//Função de checar a passagem do parâmetro nome do curso via json
function checarCurso(require, response, next) {
    if(!require.body.name) {
        return response.status(400).json({error: "Nome do curso é obrigatório"});
    }
    return next();
}

//Função de checar a existência do Id
function checarId(require,response, next, nomeCampo) {
    const curso = cursos[require.params.index];
    if(curso == null) {
        return response.status(400).json({error: "Bad Request - Object Not Found"});
    }
    return next();
}

//Retorna lista de curso
server.get('/cursos', (require, response) => {
    return response.json(cursos);
}
);

//Retorna curso pelo ID
server.get('/cursos/:index', checarId, (require, response) => {
    const {index} = require.params;
    return response.json(cursos[index]);
}
);

//Adiciona novo curso
server.post('/cursos', checarCurso, (require, response) => {
    const { name } = require.body;
    cursos.push(name);

    return response.json(cursos);
}
);

//Atualizando curso
server.put('/cursos/:index', checarCurso, checarId, (require, response) => {
    const {index} = require.params;
    const {name} = require.body;
    cursos[index] = name;

    return response.json(cursos);
}
);

//Removendo um curso
server.delete('/cursos/:index', checarId, (require, response) => {
    const {index} = require.params;
    cursos.splice(index, 1);
    return response.send();
}   
);

server.listen(3000);