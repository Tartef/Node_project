/* eslint-disable @hapi/hapi/scope-start */
'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {
        return 'films';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(3).example('The Shawshank Redemption').description('Title of the film'),
            description: Joi.string().example('Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.').description('Description of the film'),
            releaseDate: Joi.date().example('1994-10-14').description('Release date of the film'),
            director: Joi.string().example('Frank Darabont').description('Director of the film'),
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
