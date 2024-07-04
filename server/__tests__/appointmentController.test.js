const request = require('supertest');
const app = require('../server');

describe('Appointment Controller', () => {
  let token;
  
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });
    
    token = res.body.token;
  });

  it('should create an appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        psychologistId: '60d0fe4f5311236168a109ca', // Assurez-vous d'avoir une ID valide
        day: '2024-07-10',
        timeSlot: { start: '10:00', end: '11:00' }
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });
});
