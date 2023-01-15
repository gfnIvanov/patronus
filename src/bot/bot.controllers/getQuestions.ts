import _ from 'lodash';
import { Scenes, Markup } from 'telegraf';
import { db } from '@/database/database';
import { customize } from './customize';
import { start } from './start';
import { preparePatronus } from '@/bot/bot.hooks/preparePatronus';
import type { TAnswer, TQuestion } from '@/database/database.types';
import type {
    TQuestionData,
    TQuestionsIdx,
    TAnswers,
} from './bot.controllers.types';

export const getQuestions = new Scenes.BaseScene<Scenes.SceneContext>(
    'GET_QUESTIONS',
);

const questionsIdx: TQuestionsIdx = {};
const questions: TQuestionData = {};
const answers: TAnswers = {};

getQuestions.enter(async ctx => {
    db.questions.count({}, (err, count) => {
        if (err) throw new Error('Ошибка при получении данных');
        const id = String(ctx.from?.id) as string;
        questionsIdx[id] = { idx: new Set() };
        answers[id] = { list: [] };
        while (questionsIdx[id].idx.size < 5) {
            questionsIdx[id].idx.add(_.random(0, count - 1, false));
        }
        db.questions.find({}, (err: Error, data: TQuestion[]) => {
            if (err) throw new Error('Ошибка при получении данных');
            questions[id] = {
                idx: Array.from(questionsIdx[id].idx) as number[],
                data,
            };
            replyQuestions(ctx);
        });
    });
});

const clearData = function (id: string) {
    delete questionsIdx[id];
    delete questions[id];
    delete questions[id];
    delete answers[id];
};

const replyQuestions = async function (
    ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
) {
    const id = String(ctx.from?.id) as string;
    if (questions[id].idx.length > 0) {
        const index = questions[id].idx.pop();
        db.answers.find(
            { question: questions[id].data[index as number]._id },
            async (err: Error, ansVariants: TAnswer[]) => {
                if (err) throw new Error('Ошибка при получении данных');
                let questText =
                    '<b>' +
                    questions[id].data[index as number].question +
                    '</b>\n';
                let i = 1;
                const buttons = [];
                for (const item of ansVariants) {
                    questText += `${i} - ${item.answer}\n`;
                    buttons.push(
                        Markup.button.callback(`${i}`, `addAnswer_${item._id}`),
                    );
                    i++;
                }
                await ctx.replyWithHTML(questText, {
                    ...Markup.inlineKeyboard(buttons, { columns: 1 }),
                });
            },
        );
    } else {
        await ctx.reply('Обработка данных...');
        setTimeout(() => {
            preparePatronus(ctx, answers[id].list);
            clearData(id);
        }, 1000);
        ctx.scene.leave();
    }
};

getQuestions.command(['/start', '/customize'], ctx => {
    const id = String(ctx.from?.id) as string;
    const text = JSON.parse(JSON.stringify(ctx.update.message)).text;
    clearData(id);
    ctx.scene.leave();
    text.trim() === '/start' && start(ctx);
    text.trim() === '/customize' && customize(ctx);
    return;
});

getQuestions.action(/^addAnswer/, ctx => {
    const id = String(ctx.from?.id) as string;
    const callback_data = JSON.stringify(ctx.update.callback_query);
    answers[id].list.push(
        JSON.parse(callback_data).data.match(/(?<=addAnswer_).*/)[0],
    );
    replyQuestions(ctx);
});
