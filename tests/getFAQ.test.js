const request = require('supertest');
const express = require('express');
const redisClient = require('../config/redis');
const FAQ = require('../models/faq');
const getFAQ = require('../controllers/getFAQ');

const app = express();
app.get('/faq', getFAQ);

jest.mock('../config/redis');
jest.mock('../models/faq');

describe('GET /faq', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return FAQs from cache if available', async () => {
    const cachedFAQs = JSON.stringify({
      'Total Count': 2,
      translatedFAQs: [
        { id: '1', question: 'Cached Question 1', answer: 'Cached Answer 1' },
        { id: '2', question: 'Cached Question 2', answer: 'Cached Answer 2' },
      ],
    });

    redisClient.get.mockResolvedValue(cachedFAQs);

    const res = await request(app).get('/faq?lang=en');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(JSON.parse(cachedFAQs));
    expect(redisClient.get).toHaveBeenCalledWith('faqs:en\n');
  });

  it('should return FAQs from database if not in cache', async () => {
    const faqs = [
      {
        id: '1',
        translations: [
          { lang: 'en\n', question: 'Question 1', answer: 'Answer 1' },
        ],
      },
      {
        id: '2',
        translations: [
          { lang: 'en\n', question: 'Question 2', answer: 'Answer 2' },
        ],
      },
    ];

    redisClient.get.mockResolvedValue(null);
    FAQ.find.mockResolvedValue(faqs);

    const res = await request(app).get('/faq?lang=en');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      'Total Count': 2,
      translatedFAQs: [
        { id: '1', question: 'Question 1', answer: 'Answer 1' },
        { id: '2', question: 'Question 2', answer: 'Answer 2' },
      ],
    });
    expect(redisClient.get).toHaveBeenCalledWith('faqs:en\n');
    expect(redisClient.set).toHaveBeenCalledWith(
      'faqs:en\n',
      JSON.stringify({
        'Total Count': 2,
        translatedFAQs: [
          { id: '1', question: 'Question 1', answer: 'Answer 1' },
          { id: '2', question: 'Question 2', answer: 'Answer 2' },
        ],
      }),
      { EX: 1800 }
    );
  });

  it('should handle errors gracefully', async () => {
    redisClient.get.mockRejectedValue(new Error('Redis error'));

    const res = await request(app).get('/faq?lang=en');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Error fetching FAQs' });
  });
});
