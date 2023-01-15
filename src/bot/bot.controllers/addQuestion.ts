import { Scenes } from 'telegraf';
import { characters } from '@/configs/characters';
import { db } from '@/database/database';
import { customize } from './customize';
import { start } from './start';

export const addQuestion = new Scenes.BaseScene<Scenes.SceneContext>(
    'ADD_QUESTION',
);

const message = `
Для добавления вопроса необходимо отправить сообщение в следующем формате:

<b>[question]</b>Вопрос<b>[question]</b>
<b>[answers]</b>Ответ<b>[char]</b>Код персонажа, который скорее всего ответил бы именно так (скопируй из списка ниже)<b>[answers]</b>

Блок <b>[answers]</b> может содержать любое количество вариантов ответа, например: Ответ1<b>[char]</b>3<b>[ans]</b>Ответ2<b>[char]</b>1
Варианты ответа разделяются якорем <b>[ans]</b>, после открывающего и перед закрывающим <b>[answers]</b> якорь <b>[ans]</b> указывать не нужно
Каждый вариант ответа может содержать несколько персонажей, например Ответ1<b>[char]</b>3<b>[char]</b>7<b>[char]</b>10
`;

addQuestion.enter(async ctx => {
    await ctx.replyWithHTML(message);
    let chrs = '';
    for (const item of characters) {
        chrs += `${item.firstname} ${item.lastname} - ${item.code}\n`;
    }
    await ctx.reply(chrs);
});

addQuestion.on('message', async ctx => {
    try {
        const message = JSON.stringify(ctx.message);
        const text = JSON.parse(message).text;
        if (['/start', '/customize'].includes(text.trim())) {
            ctx.scene.leave();
            text.trim() === '/start' && start(ctx);
            text.trim() === '/customize' && customize(ctx);
            return;
        }
        questionHandler(message);
        await ctx.reply('Вопрос успешно добавлен!');
    } catch (err) {
        console.error(err);
    }
});

const questionHandler = function (message: string) {
    const text = JSON.parse(message).text;
    const question = text
        .match(/\[question].*\[question]/)[0]
        .replaceAll('[question]', '');
    const answers = text
        .match(/\[answers].*\[answers]/)[0]
        .replaceAll('[answers]', '');
    db.questions.insert({ question }, (err, newDoc) => {
        if (err) throw new Error('Ошибка при добавлении вопроса');
        const questionId = JSON.parse(JSON.stringify(newDoc))._id;
        const answerData = answers.split('[ans]').map((ans: string) => {
            const data = ans.split('[char]');
            return {
                answer: data[0],
                character: Array.from(new Set(data.slice(1))).join(';'),
                question: questionId,
            };
        });
        db.answers.insert(answerData);
    });
};
