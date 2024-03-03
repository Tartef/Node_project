'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Adding new column
            table.string('role').defaultTo('user');
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {

            // Dropping added column
            table.dropColumn('role');
        });
    }
};

