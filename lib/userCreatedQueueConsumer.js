const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const connectRabbitMQ = require('../server/config/rabbitMQ');
const mailService = require('./services/mail');

module.exports = class UserCreatedQueueConsumer extends Service {

    async consumeUserCreatedQueue() {
        try {
            const channel = await connectRabbitMQ();

            await channel.assertQueue('mailQueue', { durable: true });
            await channel.consume('mailQueue', async (msg) => {
                const userData = JSON.parse(msg.content.toString());

                await mailService.sendWelcomeEmail(userData.email, userData.username);

                channel.ack(msg);
            });

            console.log('Consumer started for user_created_queue');
        } catch (error) {
            console.error('Error consuming user_created_queue:', error);
            throw Boom.boomify(error);
        }
    }

};
