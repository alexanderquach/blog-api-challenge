'use strict';

const express = require('express');
const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');

BlogPosts.create(
  'Blog Post 1', 'This is the content for blog post 1. Content content content.', 'Me'
);
BlogPosts.create(
  'Blog Post 2', 'This is the content for blog post 2. Content content content.', 'Me'
);

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// router.post('/', jsonParser, (req, res) => {
router.post('/', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

// router.put('/:id', jsonParser, (req, res) => {
  router.put('/:id', (req, res) => {
  const requiredFields = ['id', 'name', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    name: req.body.name,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
})

module.exports = router;