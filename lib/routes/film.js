'use strict';
const Joi = require('joi');

module.exports = [
    {
        method: 'POST',
        path: '/films',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().example('The Shawshank Redemption').description('Title of the film'),
                    description: Joi.string().required().example('Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.').description('Description of the film'),
                    releaseDate: Joi.date().required().example('1994-10-14').description('Release date of the film'),
                    director: Joi.string().required().example('Frank Darabont').description('Director of the film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const { title, description, releaseDate, director } = request.payload;
            try {
                const film = await filmService.createFilm({ title, description, releaseDate, director });
                return h.response(film).code(201);
            } catch (error) {
                console.error('Error creating film', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
    {
        method: 'GET',
        path: '/films',
        options: {
            auth: false,
            tags: ['api']
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            try {
                const films = await filmService.getAllFilms();
                return h.response(films).code(200);
            } catch (error) {
                console.error('Error fetching all films', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
    {
        method: 'GET',
        path: '/films/{id}',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('Film ID')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const filmId = request.params.id;
            try {
                const film = await filmService.getFilmById(filmId);
                if (!film) {
                    return h.response().code(404).message(`Film with ID ${filmId} not found`);
                }
                return h.response(film).code(200);
            } catch (error) {
                console.error('Error fetching film by ID', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
    {
        method: 'PUT',
        path: '/films/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('Film ID')
                }),
                payload: Joi.object({
                    title: Joi.string().required().example('The Shawshank Redemption').description('Title of the film'),
                    description: Joi.string().required().example('Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.').description('Description of the film'),
                    releaseDate: Joi.date().required().example('1994-10-14').description('Release date of the film'),
                    director: Joi.string().required().example('Frank Darabont').description('Director of the film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const filmId = request.params.id;
            const { title, description, releaseDate, director } = request.payload;
            try {
                const updatedFilm = await filmService.updateFilm(filmId, { title, description, releaseDate, director });
                return h.response(updatedFilm).code(200);
            } catch (error) {
                console.error('Error updating film', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/films/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('Film ID')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const filmId = request.params.id;
            try {
                await filmService.deleteFilm(filmId);
                return h.response().code(204);
            } catch (error) {
                console.error('Error deleting film', error);
                return h.response().code(error.output.statusCode).message(error.message);
            }
        }
    },
];
