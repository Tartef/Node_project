'use strict';

const { Service } = require('@hapipal/schmervice');
const { Boom } = require('@hapi/boom');
const bcrypt = require('bcrypt');

module.exports = class UserService extends Service {

    async create(user) {
        try {
            const { User } = this.server.models();

            // Hasher le mot de passe avant de l'insérer dans la base de données
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;

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
            const deletionResult = await User.query().deleteById(userId);

            if (deletionResult === 0) {
                throw Boom.notFound(`User with ID ${userId} not found`);
            }

            return deletionResult;
        } catch (err) {
            console.log('error in deleteById()', err);
            throw Boom.internal('Internal Server Error');
        }
    }

    async updateById(userId, userData) {
        try {
            const { User } = this.server.models();
            let user = await User.query().findById(userId);
            if (!user) {
                throw Boom.notFound(`User with ID ${userId} not found`);
            }

            if (userData.password) {
                // Hasher le nouveau mot de passe avant de le mettre à jour
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            user = await user.$query().patchAndFetch(userData);
            return user;
        } catch (err) {
            console.error('error in updateById()', err);
            throw Boom.internal('Internal Server Error');
        }
    }

    async findByEmail(email) {
        try {
            const { User } = this.server.models();
            const user = await User.query().findOne({ email });
            return user;
        } catch (err) {
            console.error('Error in findByEmail()', err);
            throw Boom.internal('Internal Server Error');
        }
    }
};
