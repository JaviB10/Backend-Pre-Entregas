import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    const carts = await cartManager.getCarts();
    res.send(carts);
})

router.get("/:cid", async (req, res) => {
    const cid = Number(req.params.cid);
    const cartById = await cartManager.getCartById(cid);
    if (cartById) {
        return res.status(200).send(cartById);
    } else {
        return res.status(404).send({status: "error", error: "cart not found"});
    }
})

router.post("/", async (req, res) => {
    const addCart = req.body;
    await cartManager.addCarts(addCart);
    res.status(200).send({status: "success", message: "cart created"});

})

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const productToCart = await cartManager.addProductToCart(cid, pid);
    if (productToCart === false) {
        return res.status(404).send({status: "error", error: "product or cart is not found"});
    }  
    return res.status(200).send({status: "success", message: "Product added successfully"});
})

export default router;