const express = require('express');
const fs = require('fs');
const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`API is live on port ${PORT}`);
});
const DATA_FILE = './data.json';

app.use(express.json());

// Helper function to read/write (dryer code)
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// --- ROUTES ---

// GET: Fetch all items
app.get('/students', (req, res) => {
    res.json(readData());
});

// POST: Create a new item
app.post('/students', (req, res) => {
    const data = readData();
    const newItem = { id: Date.now(), ...req.body };
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

// PUT: Update an item by ID
app.put('/students/:id', (req, res) => {
    let data = readData();
    const index = data.findIndex(i => i.id === parseInt(req.params.id));
    
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        writeData(data);
        res.json(data[index]);
    } else {
        res.status(404).send("Item not found");
    }
});

// DELETE: Remove an item
app.delete('/students/:id', (req, res) => {
    let data = readData();
    const filteredData = data.filter(i => i.id !== parseInt(req.params.id));
    writeData(filteredData);
    res.status(204).send();
});

//app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));