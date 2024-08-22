import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

router.get(
   "/users",
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

router.get("/routes/users/:id", resolveIndexByUserId, (req, res) => {
   const { findUserIndex } = req;
   const findUser = mockUsers[findUserIndex];

   if (!findUser) return res.sendStatus(404);
   return res.send(findUser);
});

router.post("/routes/users", checkSchema(createUserValidationSchema), (req, res) => {
   const result = validationResult(req);
   console.log(result);

   if (!result.isEmpty()) return res.status(400).send(result.array());

   const data = matchedData(req);
   const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
   mockUsers.push(newUser);
   res.status(201).send(newUser);
});

router.put("/routes/users/:id", resolveIndexByUserId, (req, res) => {
   const { body, findUserIndex } = req;
   mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

   return res.sendStatus(200);
});

router.patch("/routes/users/:id", resolveIndexByUserId, (req, res) => {
   const { body, findUserIndex } = req;
   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

   return res.sendStatus(200);
});

router.delete("/routes/users/:id", resolveIndexByUserId, (req, res) => {
   const { findUserIndex } = req;
   mockUsers.splice(findUserIndex, 1);

   return res.sendStatus(200);
});

export default router;
