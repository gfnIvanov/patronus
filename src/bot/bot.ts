import LocalSession from 'telegraf-session-local';
import { Telegraf, Scenes } from 'telegraf';
import { config } from 'dotenv';
import { addPatronus } from './bot.controllers/addPatronus';
import { addQuestion } from './bot.controllers/addQuestion';
import { addNickname } from './bot.controllers/addNickname';
import { getQuestions } from './bot.controllers/getQuestions';
import { start } from './bot.controllers/start';
import { customize } from './bot.controllers/customize';
import { dbFinder } from '@/database/database.hooks/dbFinder';

config();

export const bot = new Telegraf<Scenes.SceneContext>(
    process.env.BOT_TOKEN ?? '',
);

const stages = new Scenes.Stage<Scenes.SceneContext>([
    addPatronus,
    addQuestion,
    addNickname,
    getQuestions,
]);

bot.use(
    new LocalSession({
        database: 'database/session/session.json',
    }).middleware(),
);
bot.use(stages.middleware());

bot.start(start);

bot.command('/customize', customize);

bot.action(['getQuestions'], ctx => ctx.scene.enter('GET_QUESTIONS'));

bot.action(['addPatronus'], ctx => ctx.scene.enter('ADD_PATRONUS'));

bot.action(['addQuestion'], ctx => ctx.scene.enter('ADD_QUESTION'));

bot.action(['addNickname'], ctx => ctx.scene.enter('ADD_NICKNAME'));

bot.action(['getPatronuses', 'getNicknames', 'getVisitors'], ctx => {
    dbFinder(ctx.match.input).exec(async (err, docs) => {
        if (err) throw new Error('Ошибка при получении данных');
        let result = '';
        for (const item of docs) {
            result += `${item.name ?? item.nickname ?? item.username}\n`;
        }
        await ctx.reply(result);
    });
});
