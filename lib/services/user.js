'use strict';

const { Service } = require('@hapipal/schmervice');
const Cryptr = require('cryptr');

const cryptr = new Cryptr('myTotallySecretKey');

module.exports = class UserService extends Service {

    async create(user) {
        try {
            const { User } = this.server.models();

            return await User.query().insertAndFetch(user);
        } catch (err) {
            console.log('error in create()', err);
        }
    }

    async getAll() {
        try {
            const { User } = this.server.models();
            return await User.query();
        } catch (err) {
            console.log('error in getAll()', err);
        }
    }

    async deleteById(userId) {
        try {
            const { User } = this.server.models();
            return await User.query().deleteById(userId);
        } catch (err) {
            console.log('error in deleteById()', err);
        }

    }
};
