/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
import Author from '../models/author';
import { IAuthor } from '../interface/tacher.interfase';

const router = express.Router();

// Get books of author by is name
router.get('/firstName/:firstName', async (req: Request, res: Response) => {
  try {
    const authorFinded : IAuthor = await Author.findOne({firstName: req.params.firstName}).populate('bookList');
    res.send(authorFinded.bookList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all authors
router.get('/', async (_req: any, res: any) => {
  const authorFinded : IAuthor = await Author.find();
  res.send(authorFinded);
});

// Creating one
router.post('/newAuthor', async (req: any, res: any) => {
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
    bookList:  req.body.bookList
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Filter specific type of author and book 
router.get('/filter', async (_req: Request, res: Response) => {
  try{
    const authorFilter : IAuthor[] = await Author.aggregate(
      [
        {
          '$match': {
            'firstName': {
              '$regex': new RegExp('^p.*$'), 
              '$options': 'i'
            }
          }
        }, {
          '$lookup': {
            'from': 'books', 
            'localField': 'bookList', 
            'foreignField': '_id', 
            'as': 'books'
          }
        }, {
          '$unwind': {
            'path': '$books'
          }
        }, {
          '$match': {
            'books.pagesNumbers': {
              '$gte': 200
            }, 
            'books.publicationDate': {
              '$gte': 2015, 
              '$lt': 2020
            }
          }
        }, {
          '$project': {
            'bookName': '$books.bookName', 
            'author': '$firstName'
          }
        }
      ]
    )
    res.json(authorFilter);
  }    
  catch(err){
    res.json({message: err});

  }
})

export default router;
