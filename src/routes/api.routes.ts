const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
import { Request, Response, NextFunction } from "express";
import { getUserByEmail, getUserById } from "../services/auth.service";
const UserModel = require("../models/user");

import {
  createBooks,
  updateBook,
  getBookById,
  deleteBook,
} from "../services/book.service";

const authorize = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// Sign-up
router.post(
  "/users/register",
  [
    check("firstName")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("firstName must be at least 3 characters long"),
    check("lastName")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("lastName must be at least 3 characters long"),
    check("email", "Email is required").not().isEmpty(),
    check("phoneNumber", "Phone number is required").not().isEmpty(),
    check("password", "Password should be between 4 to 8 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 8 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      await bcrypt.hash(req.body.password, 10).then((hash: string) => {
        const user = new UserModel({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: hash,
        });

        user
          .save()
          .then((response: any) => {
            res.status(201).json({
              statusCode: 201,
              message: "User successfully created!",
              result: response,
            });
          })
          .catch((error: Error) => {
            res.status(500).json({
              error: error,
              message:
                "Sorry, something went wrong on our server. Please try again",
            });
          });
      });
    }
  }
);

// Login
router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Password is wrong!" });

    const payload = { email, role: user.role, userId: user._id };
    const jwtToken = jwt.sign(payload, "xenon-secret", { expiresIn: "6h" });

    return res.status(200).json({
      statusCode: 200,
      accessToken: jwtToken,
      expiresIn: "6h",
      _id: user._id,
    });
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authentication failed, Please check your credentials",
    });
  }
});

router
  .route("/users/:id")
  .get(authorize, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await getUserById(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.sendStatus(error);
    }
  });

//Endpoint for creating new book
router
  .route("/books")
  .post(
    authorize,
    [
      check("title", "Title is required").not().isEmpty(),
      check("author", "Author is required").not().isEmpty(),
      check("genre", "Genre is required").not().isEmpty(),
      check("publishedDate", "publication date is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        await createBooks(req)
          .then((response: any) => {
            res.status(201).json({
              statusCode: 201,
              message: "Books successfully created!",
              result: response,
            });
          })
          .catch((error: any) => {
            res.status(500).json({
              error: error,
              message:
                "Sorry, something went wrong on our server. Please try again",
            });
          });
      }
    }
  );

//GET BOOK BY ID
router
  .route("/books/:id")
  .get(authorize, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await getBookById(id);
      console.log(user);
      return res.status(200).json(user);
    } catch (error) {
      return res.sendStatus(error);
    }
  });

//update books
router
  .route("/books/:id")
  .patch(authorize, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const book = await updateBook(id, req.body);
      if (!book) {
        return res.status(404).json({ message: `No book found with ID ${id}` });
      }

      const updatedBook = await getBookById(id);
      return res
        .status(200)
        .json({ message: "Book updated successfully", data: updatedBook })
        .end();
    } catch (error) {
      return res.sendStatus(error);
    }
  });

//DELETE BOOK BY ID
router
  .route("/books/:id")
  .delete(authorize, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await deleteBook(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.sendStatus(error);
    }
  });

module.exports = router;
