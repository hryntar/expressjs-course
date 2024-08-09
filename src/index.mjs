import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
   res.send({ message: "Hello World" });
})

app.get("/api/users/:id/:username", (req, res) => {
   console.log(req.params);
})

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
