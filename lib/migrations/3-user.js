'use strict';

module.exports = {

    async up(knex) {
        const hasRoleColumn = await knex.schema.hasColumn('user', 'role');
        if (!hasRoleColumn) {
            await knex.schema.alterTable('user', (table) => {
                // Adding new column
                table.string('role').defaultTo('user');
            });
        }
    },

    async down(knex) {
        await knex.schema.alterTable('user', (table) => {
            // Dropping added column
            table.dropColumn('role');
        });
    }
};
