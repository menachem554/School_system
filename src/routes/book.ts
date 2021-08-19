/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
import Book from '../models/books';
import {IBook} from '../interface/student.interface';

const router = express.Router();

// Create new book
router.post('/create', async (req: Request, res: Response) => {
  const book  = new Book({
    bookName: req.body.bookName,
    bookDescription: req.body.bookDescription,
    publicationDate: req.body.publicationDate,
    author: req.body.author,
    pagesNumbers: req.body.pagesNumbers,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a book by the Description or name 
router.get('/Description/:bookDescription', async (req: Request, res: Response) => {
  try {
    const bookd : IBook = await Book.find({
      bookDescription: { $regex: req.params.bookDescription, $options: 'i' },
    });
    res.send(bookd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book with number of pages
router.get('/pages/250', async (_req: Request, res: Response) => {
  try {
    const bookd : IBook = await Book.find({
      pagesNumbers: { $gt: 250 }
    }).sort("pagesNumbers");
    res.send(bookd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
