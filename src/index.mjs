import express from "express";

const app = express();

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

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
