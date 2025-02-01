const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const createFAQ = require('../controllers/createFAQ');
const FAQ = require('../models/faq');
const { translateLanguage } = require('../utils/google_translate');
const redisClient = require('../config/redis');

jest.mock('../models/faq');
jest.mock('../utils/google_translate');
jest.mock('../config/redis');

const app = express();
app.use(bodyParser.json());
app.post('/faq', createFAQ);

describe('POST /faq', () => {
  beforeEach(() => {
    FAQ.mockClear();
    translateLanguage.mockClear();
    redisClient.set.mockClear();
  });

  it('should create a new FAQ and return 201 status', async () => {
    translateLanguage.mockImplementation((text, lang) =>
      Promise.resolve(`${text}-${lang}`)
    );
    FAQ.prototype.save.mockImplementation(() => Promise.resolve());
    redisClient.set.mockImplementation(() => Promise.resolve());

    const response = await request(app).post('/faq').send({
      question: 'What is your name?',
      answer: 'My name is GitHub Copilot.',
    });

    expect(response.status).toBe(201);
    expect(redisClient.set).toHaveBeenCalled();
  });

  it('should return 500 status if there is an error', async () => {
    translateLanguage.mockImplementation(() =>
      Promise.reject(new Error('Translation error'))
    );

    const response = await request(app).post('/faq').send({
      question: 'What is your name?',
      answer: 'My name is GitHub Copilot.',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error creating FAQ');
  });
});
