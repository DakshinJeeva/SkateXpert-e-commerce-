const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Add Product
router.post('/add', upload.single('image'), async (req, res) => {
    console.log('Body:', req.body);  // Debug body
    console.log('File:', req.file);
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            image: `/uploads/${req.file.filename}`,
            category: req.body.category,
            stock: req.body.stock,
            description: req.body.description,
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Delete Product
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to delete product with ID:', id);
    try {
        const result = await Product.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ error: error.message });
    }
});
router.patch('/update-stock/:id', async (req, res) => {
    try {
        const { stock } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
