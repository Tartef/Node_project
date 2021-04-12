'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();

        return await User.query().insertAndFetch(user);
    }

    async getAll() {

        const { User } = this.server.models();

        return await User.query();
    }

    async deleteById(userId) {

        const { User } = this.server.models();

        return await User.query().deleteById(userId);

    }
};
