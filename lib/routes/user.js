'use strict';

const Joi = require('joi');

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
                    email: Joi.string().required().email().example('john.doe@etu.unilim.fr').description('Email of the user'),
                    password: Joi.string().required().min(8).example('password').description('Password of the user (at least 8 characters)'),
                    username: Joi.string().required().example('jdoe').description('Username of the user')
                })
            }
        },
        // eslint-disable-next-line require-await
        handler: async (request, h) => {

            const { userService } = request.services();

            return userService.create(request.payload);
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

            await userService.deleteById(userId);

            return h.response().code(204);
        }
    }
];
