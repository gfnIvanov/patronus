import { Scenes } from 'telegraf';
import { characters } from '@/configs/characters';
import { db } from '@/database/database';
import { start } from './start';
import { customize } from './customize';

export const addNickname = new Scenes.BaseScene<Scenes.SceneContext>(
    'ADD_NICKNAME',
);

const message = `
Для добавления прозвища персонажа необходимо просто отправить его прозвище.

Прозвище будет случайным образом присваиваться персонажу, например, скучный Гарри Поттер станет задорным Гарри "Потная жопа" Поттером и т.д.

Имя самого персонажа писать не надо, прозвище может достаться любому из спика ниже.
`;

addNickname.enter(async ctx => {
    await ctx.replyWithHTML(message);
    let chrs = '';
    for (const item of characters) {
        chrs += `${item.firstname} ${item.lastname} - ${item.code}\n`;
    }
    await ctx.reply(chrs);
});

addNickname.on('message', async ctx => {
    try {
        const message = JSON.parse(JSON.stringify(ctx.message));
        if (['/start', '/customize'].includes(message.text.trim())) {
            ctx.scene.leave();
            message.text.trim() === '/start' && start(ctx);
            message.text.trim() === '/customize' && customize(ctx);
            return;
        }
        nicknameHandler(message);
        await ctx.reply('Прозвище успешно добавлено!');
    } catch (err) {
        console.error(err);
    }
});

const nicknameHandler = function (message: { text: string }) {
    db.nicknames.insert({ nickname: message.text });
};
