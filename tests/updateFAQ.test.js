const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const FAQ = require('../models/faq');
const updateFAQ = require('../controllers/updateFAQ');
const redisClient = require('../config/redis');

const app = express();
app.use(express.json());
app.put('/faq/:id', updateFAQ);

jest.mock('../models/faq');
jest.mock('../utils/google_translate', () => ({
  translateLanguage: jest.fn((text, lang) =>
    Promise.resolve(`${text}-${lang}`)
  ),
}));
jest.mock('../config/redis');

describe('updateFAQ Controller', () => {
  beforeAll(() => {
    mongoose.connect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update FAQ and return 200 status', async () => {
    const faqId = '60d21b4667d0d8992e610c85';
    const reqBody = {
      question: 'What is your name?',
      answer: 'My name is GitHub Copilot.',
    };
    const updatedFAQ = {
      _id: faqId,
      translations: [
        {
          lang: 'en',
          question: 'What is your name?-en',
          answer: 'My name is GitHub Copilot.-en',
        },
        {
          lang: 'hi',
          question: 'What is your name?-hi',
          answer: 'My name is GitHub Copilot.-hi',
        },
        {
          lang: 'es',
          question: 'What is your name?-es',
          answer: 'My name is GitHub Copilot.-es',
        },
        {
          lang: 'fr',
          question: 'What is your name?-fr',
          answer: 'My name is GitHub Copilot.-fr',
        },
        {
          lang: 'ja',
          question: 'What is your name?-ja',
          answer: 'My name is GitHub Copilot.-ja',
        },
      ],
    };

    FAQ.findByIdAndUpdate.mockResolvedValue(updatedFAQ);
    redisClient.setEx.mockResolvedValue(true);

    const res = await request(app).put(`/faq/${faqId}`).send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedFAQ);
    expect(FAQ.findByIdAndUpdate).toHaveBeenCalledWith(
      faqId,
      { translations: updatedFAQ.translations },
      { new: true }
    );
    expect(redisClient.setEx).toHaveBeenCalledWith(
      `faq:${faqId}`,
      3600,
      JSON.stringify(updatedFAQ)
    );
  });

  it('should return 404 if FAQ not found', async () => {
    const faqId = '60d21b4667d0d8992e610c85';
    const reqBody = {
      question: 'What is your name?',
      answer: 'My name is GitHub Copilot.',
    };

    FAQ.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app).put(`/faq/${faqId}`).send(reqBody);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'FAQ not found' });
  });

  it('should return 500 if there is an error', async () => {
    const faqId = '60d21b4667d0d8992e610c85';
    const reqBody = {
      question: 'What is your name?',
      answer: 'My name is GitHub Copilot.',
    };

    FAQ.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

    const res = await request(app).put(`/faq/${faqId}`).send(reqBody);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Error updating FAQ' });
  });
});
