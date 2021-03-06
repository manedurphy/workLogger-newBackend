import app, { server } from '../../serverStart';
import request from 'supertest';
import sequelize from '../../data/SQLDatabase';
import userData from '../../mock/user/userData';
import { HttpResponse } from '../../constants/HttpResponse';
import { ValidationMessages } from '../../constants/ValidationMessages';
import { User } from '../../models';

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await sequelize.sync({ force: true });
});

afterEach(async () => server.close());

describe('Users Controller /api/users', () => {
    test('/POST /register fails on password mismatch', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.fail);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(ValidationMessages.PASSWORDS_DO_NOT_MATCH);
    });
    test('/POST /register fails with missing first name', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.invalid.firstName);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(ValidationMessages.FIRST_NAME);
    });
    test('/POST /register fails with missing last name', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.invalid.lastName);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(ValidationMessages.LAST_NAME);
    });
    test('/POST /register fails with password length less than 6 characters', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.invalid.password);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(ValidationMessages.PASSWORD);
    });
    test('/POST /register success', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.success);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe(HttpResponse.USER_CREATED);
    });
    test('One user should exist in the database', async () => {
        const users = await User.findAll();
        expect(users).toHaveLength(1);
    });

    test('/POST /register fails if user with same email already exists', async () => {
        const res = await request(app).post('/api/users/register').send(userData.register.success);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.USER_EXISTS);
    });
    test('/POST /login fails with invalid credentials', async () => {
        const user = await User.findByPk(1);
        if (user) await user.update({ active: true });

        const res = await request(app).post('/api/users/login').send(userData.login.fail);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.INVALID_CREDENTIALS);
    });
    test('/POST /login success', async () => {
        const res = await request(app).post('/api/users/login').send(userData.login.success);

        expect(res.status).toBe(200);
        expect(res.body.jwt).toBeTruthy();
        expect(res.body.refreshToken).toBeTruthy();
        expect(res.body.firstName).toBe('Test');
        expect(res.body.lastName).toBe('User');
        expect(res.body.email).toBe('testuser@mail.com');
    });
    test('/POST /login fails if account is not active', async () => {
        await request(app).post('/api/users/register').send(userData.register.inactive);

        const res = await request(app).post('/api/users/login').send(userData.register.inactive);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(HttpResponse.USER_NOT_VERIFIED);
    });
    test('/GET /verify-token', async () => {
        const loginRes = await request(app).post('/api/users/login').send(userData.login.success);

        const res = await request(app)
            .get('/api/users/verify-token')
            .set('Authorization', `Bearer ${loginRes.body.jwt}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('firstName');
        expect(res.body).toHaveProperty('lastName');
        expect(res.body).toHaveProperty('email');
    });
    test('/GET /refresh', async () => {
        const loginRes = await request(app).post('/api/users/login').send(userData.login.success);

        const res = await request(app)
            .get('/api/users/refresh')
            .set('Authorization', `Bearer ${loginRes.body.refreshToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('jwt');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('firstName');
        expect(res.body).toHaveProperty('lastName');
        expect(res.body).toHaveProperty('email');
    });
});
