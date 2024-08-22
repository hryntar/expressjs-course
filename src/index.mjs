import express from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const PORT = process.env.PORT || 3000;

const mockUsers = [
   { id: 1, name: "John", age: 25 },
   { id: 2, name: "Jane", age: 22 },
   { id: 3, name: "Doe", age: 30 },
   { id: 4, name: "Smith", age: 40 },
   { id: 5, name: "Doe", age: 30 },
];
const app = express();

app.use(express.json());

const resolveIndexByUserId = (req, res, next) => {
   const {
      params: { id },
   } = req;
   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return res.sendStatus(400);

   const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
   if (findUserIndex === -1) return res.sendStatus(404);
   req.findUserIndex = findUserIndex;
   next();
};

app.get("/", (req, res) => {
   res.send({ message: "Hello World" });
});

app.get(
   "/api/users",
   query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({ min: 3, max: 10 }).withMessage("Must be 3-10 characters"),
   (req, res) => {
      const result = validationResult(req);
      console.log(result);

      const {
         query: { filter, value },
      } = req;
      if (filter && value) {
         const filteredUsers = mockUsers.filter((user) => user[filter] === value);
         return res.send(filteredUsers);
      }
      res.send(mockUsers);
   }
);

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
   const { findUserIndex } = req;
   const findUser = mockUsers[findUserIndex];

   if (!findUser) return res.sendStatus(404);
   return res.send(findUser);
});

app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
   const result = validationResult(req);
   console.log(result);

   if (!result.isEmpty()) return res.status(400).send(result.array());

   const data = matchedData(req);
   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
   mockUsers.push(newUser);
   res.status(201).send(newUser);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
   const { body, findUserIndex } = req;
   mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

   return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
   const { body, findUserIndex } = req;
   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

   return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
   const { findUserIndex } = req;
   mockUsers.splice(findUserIndex, 1);

   return res.sendStatus(200);
});

app.listen(PORT, () => {
   console.log(`Running on port ${PORT}`);
});
