import fs from "fs";
import ProductManager from "../managers/ProductManager.js";

const path = "./src/files/Carts.json"
const productManager = new ProductManager();

export default class CartManager {

    getCarts = async () => {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    addCarts = async () => {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length + 1,
                products: []
            };
            await carts.push(newCart);
            await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (idCart) => {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === idCart);
            if (cartIndex === -1) {
                console.log ("Not found");
            } else {
                return carts[cartIndex];
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProductToCart = async (idCart, idProduct) => {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === idCart);
        const product = await productManager.getProductById(idProduct);
        if (!cart || !product) {
            return false;
        }
        const productID = cart.products.map(product => product.id);
        if (productID.includes(product.id)) {
            const productIndex = cart.products.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            }
        } else {
            const newProduct = {
                id: product.id,
                quantity: 1
            }
            cart.products.push(newProduct);
        }
        await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
        return cart;
    }
}