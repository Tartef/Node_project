'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            email: Joi.string().email().example('john.doe@etu.unilim.fr').description('Email of the user'),
            password: Joi.string().min(8).example('password').description('Password of the user (at least 8 characters)'),
            username: Joi.string().example('jdoe').description('Username of the user'),
            role: Joi.string().default('user').description('Role of the user'),
            favoriteFilms: Joi.array().items(Joi.number().integer().greater(0)).default([]).description('List of favorite films'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

};
