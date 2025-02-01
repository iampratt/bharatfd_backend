const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const deleteFAQ = require('../controllers/deleteFAQ');
const FAQ = require('../models/faq');

const app = express();
app.use(express.json());
app.delete('/faq/:id', deleteFAQ);

jest.mock('../models/faq');

describe('DELETE /faq/:id', () => {
  it('should delete an FAQ and return 200 status', async () => {
    const faqId = new mongoose.Types.ObjectId().toHexString();
    FAQ.findByIdAndDelete.mockResolvedValue({ _id: faqId });

    const res = await request(app).delete(`/faq/${faqId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'FAQ deleted successfully' });
  });

  it('should return 404 if FAQ not found', async () => {
    const faqId = new mongoose.Types.ObjectId().toHexString();
    FAQ.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete(`/faq/${faqId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'FAQ not found' });
  });

  it('should return 500 if there is a server error', async () => {
    const faqId = new mongoose.Types.ObjectId().toHexString();
    FAQ.findByIdAndDelete.mockRejectedValue(new Error('Server error'));

    const res = await request(app).delete(`/faq/${faqId}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Server error',
    });
  });
});
