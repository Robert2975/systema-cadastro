// Importar dependências
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Configuração do bodyParser
app.use(bodyParser.json());

// Conectar ao banco de dados
mongoose.connect('mongodb://localhost:27017/db_wms', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir o modelo de dados
const ProdutoSchema = new mongoose.Schema({
    descricao: { 
        type: String, 
        maxlength: 200, 
        required: true, 
        unique: true
    },
    quantidade: { 
        type: Number, 
        required: true 
    },
    precoCompra: { 
        type: Number, 
        required: true 
    },
    dataEntrada: { 
        type: Date, 
        required: true
    }
});
const Produto = mongoose.model('Produto', ProdutoSchema);

// Habilitar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// CRUD

// Create
app.post('/produtos', async(req, res) => {
    try {
        const {descricao} = req.body
        const produtoExistente = await Produto.findOne({ descricao });
        if (produtoExistente) {
            return res.status(400).json({ message: 'Já existe um produto com essa descrição' });
        }
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).send(produto);
        } catch (error) {
        res.status(400).send(error);
        }
});

// Read
app.get('/produtos', (req, res) => {
    Produto.find().then((produtos) => {
        res.send(produtos);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

// Read by ID
app.get('/produtos/:id', (req, res) => {
    Produto.findById(req.params.id).then((produto) => {
        if (!produto) {
            res.status(404).send({ message: 'Produto não encontrado' });
        } else {
            res.send(produto);
        }
    }).catch((err) => {
        res.status(500).send(err);
    });
});

// Update
app.put('/produtos/:id', (req, res) => {
    Produto.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, produto) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(produto);
        }
    });
});

// Delete
app.delete('/produtos/:id', (req, res) => {
    Produto.findByIdAndRemove(req.params.id, (err, produto) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({ message: 'Produto removido com sucesso' });
        }
    });
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost:${port}`);
});