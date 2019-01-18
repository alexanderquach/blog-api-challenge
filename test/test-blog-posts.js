const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai
    .request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.at.least(1);
      const expectedKeys = ['id', 'title', 'author', 'content', 'publishDate'];
      res.body.forEach(function(post) {
        expect(post).to.be.a('object');
        expect(post).to.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog post on POST', function() {
  const newPost = {
    title: 'test post',
    author: 'test author',
    content: 'test content',
  }; 
  return chai
    .request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      const expectedKeys = ['id', 'title', 'author', 'content', 'publishDate'];
      expect(res.body).to.include.keys(expectedKeys);
      expect(res.body.id).to.not.equal(null);
      expect(res.body).to.deep.equal(
        Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate})
      );
    });
  });

  it('should update blog posts on PUT', function() {
    const updatePost = {
      title: 'updated post',
      author: 'updated author',
      content: 'updated content',
      publishDate: 'updated date'     
    };
    return (
      chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = res.body[0].id;
        return chai
          .request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updatePost);
      })
    );
  });

  it('should delete blog post on DELETE', function() {
    return (
      chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai
        .request(app)
        .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      })
    );
  });
});