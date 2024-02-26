'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom  = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('@hapi/jwt');
const nodemailer = require('nodemailer');

module.exports = class UserService extends Service {

    async authenticate(username, password) {
        try {
            const user = await this.findByUsername(username);

            if (!user) {
                throw Boom.unauthorized('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw Boom.unauthorized('Invalid credentials');
            }

            const token = this.generateToken(user);

            return token;
        } catch (error) {
            throw Boom.boomify(error);
        }
    }
    async sendWelcomeEmail(user) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });

            await transporter.sendMail({
                from: '"Votre Nom" <votre@email.com>',
                to: user.email,
                subject: 'Bienvenue sur notre plateforme',
                text: `Bonjour ${user.firstName}, bienvenue sur notre plateforme !`
            });

            console.log('E-mail de bienvenue envoyé avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail de bienvenue :', error);
            throw Boom.internal('Erreur lors de l\'envoi de l\'e-mail de bienvenue');
        }
    }

    generateToken(userData) {
        return jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                scope: userData.role
            },
            {
                key: 'myextremelygoodkey',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );
    }

    async findByUsername(username) {
        try {
            const { User } = this.server.models();
            const user = await User.query().findOne({ username });
            return user;
        } catch (error) {
            throw Boom.internal('Internal Server Error');
        }
    }

    async create(user) {
        try {
            const { User } = this.server.models();

            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;

            user.role = 'user';

            const createdUser = await User.query().insertAndFetch(user);

            await this.sendWelcomeEmail(createdUser);

            return createdUser;
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
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            user = await user.$query().patchAndFetch(userData);
            return user;
        } catch (err) {
            console.error('error in updateById()', err);
            throw Boom.internal('Internal Server Error');
        }
    }

    async updateRoleById(userId, role) {
        try {
            const { User } = this.server.models();
            const user = await User.query().findById(userId);
            if (!user) {
                throw Boom.notFound(`User with ID ${userId} not found`);
            }

            // Mettre à jour le rôle de l'utilisateur avec le rôle fourni dans la requête
            user.role = role;
            await user.$query().patch({ role });

            return user;
        } catch (err) {
            console.error('Error in updateRoleById()', err);
            throw Boom.internal('Internal Server Error');
        }
    }


    async findById(userId) {
        try {
            const { User } = this.server.models();
            return await User.query().findById(userId);
        } catch (error) {
            console.error('Error in findById()', error);
            throw Boom.internal('Internal Server Error');
        }
    }

};
