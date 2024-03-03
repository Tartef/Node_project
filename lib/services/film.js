'use strict';

const { Service } = require('@hapipal/schmervice');
module.exports = class FilmService extends Service {

    async createFilm(filmData) {
        try {
            const { Film } = this.server.models();
            return await Film.query().insert(filmData);
        } catch (error) {
            console.error('Error creating film', error);
            throw this.boomify(error);
        }
    }

    async getAllFilms() {
        try {
            const { Film } = this.server.models();
            return await Film.query();
        } catch (error) {
            console.error('Error fetching all films', error);
            throw this.boomify(error);
        }
    }

    async getFilmById(filmId) {
        try {
            const { Film } = this.server.models();
            return await Film.query().findById(filmId);
        } catch (error) {
            console.error('Error fetching film by ID', error);
            throw this.boomify(error);
        }
    }

    async updateFilm(filmId, updatedData) {
        try {
            const { Film } = this.server.models();
            await Film.query().findById(filmId).patch(updatedData);
            return await Film.query().findById(filmId);
        } catch (error) {
            console.error('Error updating film', error);
            throw this.boomify(error);
        }
    }

    async deleteFilm(filmId) {
        try {
            const { Film } = this.server.models();
            await Film.query().deleteById(filmId);
        } catch (error) {
            console.error('Error deleting film', error);
            throw this.boomify(error);
        }
    }
};
