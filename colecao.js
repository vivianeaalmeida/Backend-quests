const express = require('express');
const app = express();
const port = 3000;

let colecao = []; 

app.use(express.json());

app.get('/api/colecao/:id', (req, res) => {
  const id = req.params.id;
  const item = colecao.find(obj => obj.id === parseInt(id));

  if (item) {
    res.status(200).json(item);
  } else {
    res.sendStatus(404);
  }
});

app.patch('/api/colecao/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;

  let itemIndex = colecao.findIndex(obj => obj.id === parseInt(id));

  if (itemIndex !== -1) {
    colecao[itemIndex] = { ...updatedItem, id: parseInt(id) };
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.post('/api/colecao', (req, res) => {
  const newItem = req.body;

  const existingItem = colecao.find(obj => obj.id === newItem.id);
  if (existingItem) {
    res.sendStatus(409);
  } else {
    colecao.push(newItem);
    res.sendStatus(200);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
