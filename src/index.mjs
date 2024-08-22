import express from "express";
import routes from "./routes/index.mjs";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
   res.send({ message: "Hello World" });
});

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
