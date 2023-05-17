import {generateProduct} from '../util.js'

faker.locale = 'es';

export const getProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 50; i++) {
            products.push(generateProduct());
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener los productos:"});
    }
};