'use strict';

exports.up = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.jsonb('favorite_films');
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('favorite_films');
    });
};
