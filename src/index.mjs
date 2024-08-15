import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
   { id: 1, name: "John", age: 25 },
   { id: 2, name: "Jane", age: 22 },
   { id: 3, name: "Doe", age: 30 },
   { id: 4, name: "Smith", age: 40 },
   { id: 5, name: "Doe", age: 30 },
];

app.get("/", (req, res) => {
   res.send({ message: "Hello World" });
});

app.get("/api/users", (req, res) => {
   const {
      query: { filter, value },
   } = req;
   if (filter && value) {
      const filteredUsers = mockUsers.filter((user) => user[filter] === value);
      return res.send(filteredUsers);
   }
   res.send(mockUsers);
});

app.get("/api/users/:id", (req, res) => {
   const { id } = req.params;
   const user = mockUsers.find((user) => user.id === parseInt(id));
   if (!user) {
      return res.status(404).send({ message: "User not found" });
   }
   res.send(user);
});

app.post("/api/users", (req, res) => {
   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...req.body };
   mockUsers.push(newUser);
   res.status(201).send(newUser);
});

app.put("/api/users/:id", (req, res) => {
   const {
      body,
      params: { id },
   } = req;
   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return res.sendStatus(400);

   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
   if (findUserIndex === -1) return res.sendStatus(404);

   mockUsers[findUserIndex] = { id: parsedId, ...body };

   return res.sendStatus(204);
});

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
