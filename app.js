const express = require("express");
const morgan = require("morgan");

const productsRouter = require("./routes/products");

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use("/products", productsRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
