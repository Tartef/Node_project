'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Boom } = require('@hapi/boom');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    email: Joi.string().required().email().example('john.doe@example.com').description('Email of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user (at least 8 characters)'),
                    username: Joi.string().required().min(3).example('jdoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userData = request.payload;
            try {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashedPassword;

                const user = await userService.create(userData);
                return h.response(user).code(201);
            } catch (err) {
                console.error('Error in create user route', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api'],
            handler: async (request, h) => {

                const { userService } = request.services();

                return await userService.getAll(request.payload);
            }
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to delete')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;

            try {
                const deletionResult = await userService.deleteById(userId);

                if (deletionResult === 0) {
                    return h.response().code(404).message(`User with ID ${userId} not found`);
                }

                return h.response().code(204);
            } catch (err) {
                console.error('Error in delete user route', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to update')
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3).example('John').description('Updated firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Updated lastname of the user'),
                    email: Joi.string().min(3).example('john.doe@etu.unilim.fr').description('Updated email of the user'),
                    password: Joi.string().min(8).example('password').description('Updated password of the user'),
                    username: Joi.string().min(3).example('Jdoe').description('Updated username of the user')
                }).min(1) // At least one field is required for update
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;
            try {
                const updatedUser = await userService.updateById(userId, request.payload);
                return h.response(updatedUser).code(200);
            } catch (err) {
                console.error('Error in update user route', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().required().email().example('john.doe@example.com').description('Email of the user'),
                    password: Joi.string().required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { email, password } = request.payload;
            try {
                const user = await userService.findByEmail(email);
                if (!user) {
                    return h.response().code(401).message('Unauthorized');
                }

                const decryptedPassword = cryptr.decrypt(user.password);
                console.log('decryptedPassword', decryptedPassword, 'password', password);
                if (decryptedPassword === password) {
                    return h.response({ login: 'successful' }).code(200);
                } else {
                    return h.response().code(401).message('Unauthorized');
                }
            } catch (err) {
                console.error('Error in user login route', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    }
];
