const dados = require('./data/doencas.json')
const express = require('express')
const fs = require('fs')
const cors = require('cors')

const server = express()
server.use(cors())
server.use(express.json())

server.listen(3000, () => {
    console.log("O servidor está funcional");
})

server.get('/', (req, res) => {
    return res.json({ mensagem: "Estou funcionando!" })
})

// CRUD DA API

// Create da API
server.post('/doencas', (req, res) => {
    const { nome, causas, sintomas, tratamento, prevencao } = req.body

    if (!nome || !causas || !sintomas || !tratamento) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" })
    } else {
        const novaDoença = {
            id: dados.Doencas.length + 1,   
            nome: nome,
            causas: causas,
            sintomas: sintomas,
            tratamento: tratamento,
            prevencao: prevencao
        }

        dados.Doencas.push(novaDoença)
        salvarDados(dados)

        return res.status(201).json({ mensagem: "Doença cadastrada com sucesso!" })
    }
})

// Read da API
server.get('/doencas', (req, res) => {
    return res.json(dados.Doencas)
})

// Update da API
server.put('/doencas/:id', (req, res) => {
    const doencaID = parseInt(req.params.id)
    const atualizarDoenca = req.body

    const indiceDoenca = dados.Doencas.findIndex(u => u.id === doencaID)

    if (indiceDoenca === -1) {
        return res.status(404).json({ mensagem: "Doença não encontrada" })
    } else {
        dados.Doencas[indiceDoenca].nome = atualizarDoenca.nome || dados.Doencas[indiceDoenca].nome
        
        dados.Doencas[indiceDoenca].causas = atualizarDoenca.causas || dados.Doencas[indiceDoenca].causas

        dados.Doencas[indiceDoenca].sintomas = atualizarDoenca.sintomas || dados.Doencas[indiceDoenca].sintomas

        dados.Doencas[indiceDoenca].tratamento = atualizarDoenca.tratamento || dados.Doencas[indiceDoenca].tratamento

        dados.Doencas[indiceDoenca].prevencao = atualizarDoenca.prevencao || dados.Doencas[indiceDoenca].prevencao

        salvarDados(dados)

        return res.status(201).json({ mensagem: "Dados completos, atualização feita com sucesso!" })
    }
})

//Delete da API
server.delete('/doencas/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // filtrar os Doenças, removendo pelo id correspondente
    
    dados.Doencas = dados.Doencas.filter(u => u.id !== id)

    salvarDados(dados)

    return res.status(200).json({ mensagem: "Doença excluida com sucesso!" })
})

// Função que salva os dados
function salvarDados() {
    fs.writeFileSync(__dirname + '/data/doencas.json', JSON.stringify(dados, null, 2))
}