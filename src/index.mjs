import express from "express";
import routes from "./routes/index.mjs"; 
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

app.get("/", (req, res) => {
   console.log(req.cookies);
   res.cookie("hello", "world", { maxAge: 60000 * 60 * 2})
   res.send({ message: "Hello World" });
});

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
