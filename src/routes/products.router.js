import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();  
    const limit = Number(req.query.limit) || products.length;
    const objetsLimit = products.slice(0, limit);
    res.send(objetsLimit);
})

router.get("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    const productById = await productManager.getProductById(pid);
    if (productById) {
        return res.status(200).send(productById);
    } else {
        return res.status(404).send({status: "error", error: "product not found"});
    }
})

router.post("/", async (req, res) => {
    const addProduct = req.body;
    const newProduct = await productManager.addProducts(addProduct);
    if (newProduct) {
        return res.status(200).send({status: "success", message: "product created"});
    } else if (newProduct === false){
        return res.status(400).send({status: "error", error: "incomplete values"});
    } else {
        return res.status(400).send({status: "error", error: "product code already in use"});
    }
})

router.put("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    const newProduct = req.body;
    const productUpdate = await productManager.getUpdate(pid,newProduct);
    if (productUpdate === true) {
        return res.status(200).send({status: "success", message: "product updated"});
    } else if (productUpdate === false) {
        return res.status(404).send({status: "error", error: "product not exist"});
    } else {
        return res.status(400).send({status: "error", error: "ID cannot be modified"});
    }
})

router.delete("/:pid", async (req, res) => {
    const pid = Number(req.params.pid);
    const productFound = await productManager.getDelete(pid);
    if (productFound) {
        return res.status(200).send({status: "success", message: "product deleted"});
    } else {
        return res.status(404).send({status: "error", error: "product not exist"});
    }
})

export default router;
