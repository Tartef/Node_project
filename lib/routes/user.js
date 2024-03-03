'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Boom } = require('@hapi/boom');


module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('Florian').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Contie').description('Lastname of the user'),
                    email: Joi.string().required().email().example('florian.contie@example.com').description('Email of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user (at least 8 characters)'),
                    username: Joi.string().required().min(3).example('Tartef').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userData = request.payload;
            try {
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
            auth: {
                scope: [ 'admin', 'user' ]
            },
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
            auth: {
                scope: [ 'admin' ]
            },
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
            auth: {
                scope: [ 'admin' ]
            },
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
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().example('jdoe').description('Username of the user'),
                    password: Joi.string().required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { username, password } = request.payload;
            try {
                const token = await userService.authenticate(username, password);
                return h.response({ token }).code(200);
            } catch (error) {
                console.error('Error in user login route', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    }
    ,
    {
        method: 'patch',
        path: '/user/{id}/grant-admin',
        options: {
            tags: ['api'],
            auth: {
                scope: [ 'admin' ]
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID of the user to grant admin role')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;
            try {
                const user = await userService.findById(userId);
                if (!user) {
                    return h.response().code(404).message(`User with ID ${userId} not found`);
                }

                await userService.updateRoleById(userId, 'admin');

                return h.response().code(200).message(`Admin role granted to user with ID ${userId}`);
            } catch (err) {
                console.error('Error granting admin role to user', err);
                return h.response().code(500).message('Internal Server Error');
            }
        }
    },
    {
        method: 'POST',
        path: '/users/{userId}/favorite',
        options: {
            auth: {
                scope: ['user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    userId: Joi.number().integer().required().description('User ID')
                }),
                payload: Joi.object({
                    filmId: Joi.number().integer().required().description('Film ID')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.userId;
            const filmId = request.payload.filmId;
            try {
                await userService.addFilmToFavorites(userId, filmId);
                return h.response().code(204);
            } catch (error) {
                console.error('Error adding film to favorites', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    }
];
