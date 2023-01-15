import path from 'path';
import stream from 'stream/promises';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { NarrowedContext, Scenes } from 'telegraf';
import type { Message, Update } from 'telegraf/types';
import { characters } from '@/configs/characters';
import { db } from '@/database/database';
import { customize } from './customize';
import { start } from './start';

export const addPatronus = new Scenes.BaseScene<Scenes.SceneContext>(
    'ADD_PATRONUS',
);

const message = `
Для добавления патронуса необходимо отправить сообщение в следующем формате:

<b>[name]</b>Наименование патронуса<b>[name]</b>
<b>[title]</b>Описание патронуса<b>[title]</b>
<b>[character]</b>Код персонажа, которому подходит патронус (скопируй из списка ниже)<b>[character]</b>

Чтобы добавить изображение патронуса, просто прикрепи его к сообщению с описанием
`;

addPatronus.enter(async ctx => {
    await ctx.replyWithHTML(message);
    let chrs = '';
    for (const item of characters) {
        chrs += `${item.firstname} ${item.lastname} - ${item.code}\n`;
    }
    await ctx.reply(chrs);
});

addPatronus.on('message', async ctx => {
    try {
        const message = JSON.stringify(ctx.message);
        const text = JSON.parse(message).text ?? JSON.parse(message).caption;
        if (['/start', '/customize'].includes(text.trim())) {
            ctx.scene.leave();
            text.trim() === '/start' && start(ctx);
            text.trim() === '/customize' && customize(ctx);
            return;
        }
        await patronusHandler(ctx, message);
        await ctx.reply('Патронус успешно добавлен!');
    } catch (err) {
        console.error(err);
    }
});

const patronusHandler = async function (
    ctx: NarrowedContext<
        Scenes.SceneContext<Scenes.SceneSessionData>,
        Update.MessageUpdate<Message>
    >,
    message: string,
) {
    const messageData = JSON.parse(message);
    const text = messageData.text ?? messageData.caption;
    const name = text.match(/\[name].*\[name]/)[0].replaceAll('[name]', '');
    const title = text.match(/\[title].*\[title]/)[0].replaceAll('[title]', '');
    const character = text
        .match(/\[character].*\[character]/)[0]
        .replaceAll('[character]', '');
    db.patronuses.insert({ name, title, character }, async (err, newDoc) => {
        if (err) throw new Error('Ошибка при добавлении патронуса');
        const patronusId = JSON.parse(JSON.stringify(newDoc))._id;
        if (messageData.photo) {
            const fileId =
                messageData.photo[messageData.photo.length - 1].file_id;
            const { file_path } = await ctx.telegram.getFile(fileId);
            const { data } = await axios.get(
                `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`,
                { responseType: 'stream' },
            );
            const writeStream = createWriteStream(
                `public/${patronusId}${path.extname(file_path as string)}`,
            );
            await stream.pipeline(data, writeStream);
        }
    });
};
