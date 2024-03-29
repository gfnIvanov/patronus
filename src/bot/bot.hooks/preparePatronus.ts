import _ from 'lodash';
import { readFileSync, existsSync } from 'node:fs';
import { db } from '@/database/database';
import { characters as persDocs } from '@/configs/characters';
import type {
    TAnswer,
    TNickname,
    TPatronuses,
} from '@/database/database.types';
import type { Scenes } from 'telegraf';

export function preparePatronus(
    ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
    answers: string[],
) {
    try {
        db.answers.find(
            { _id: { $in: answers } },
            (err: Error, answers: TAnswer[]) => {
                if (err) throw new Error('Ошибка при получении данных');
                const characters = new Map();
                answers.forEach(answer => {
                    answer.character.split(';').forEach(char => {
                        characters.set(
                            char,
                            characters.has(char) ? characters.get(char) + 1 : 1,
                        );
                    });
                });
                const result = {
                    char: '',
                    count: 0,
                };
                for (const char of characters) {
                    if (char[1] > result.count) {
                        result.char = char[0];
                        result.count = char[1];
                    }
                }
                db.patronuses.find(
                    { character: result.char },
                    async (err: Error, patronuses: TPatronuses[]) => {
                        if (err) throw new Error('Ошибка при получении данных');
                        if (
                            patronuses.length === 0 ||
                            _.random(0, 50, false) === 5
                        ) {
                            await ctx.replyWithHTML(
                                'Патронус не найден, похоже ты сквиб или простой маггл, пошел нахуй!\nИли можешь пойти и попробовать еще раз <span class="tg-spoiler">/start</span>, вдруг повезет)',
                            );
                            await ctx.replyWithHTML(
                                '<a href="https://t.me/kakul_podcast">Заглянуть на канал создателей</a>',
                            );
                            return;
                        }
                        const patronus =
                            patronuses[
                                _.random(0, patronuses.length - 1, false)
                            ];
                        const persDoc = persDocs.find(
                            doc => doc.code === +patronus.character,
                        );
                        db.nicknames.find(
                            {},
                            async (err: Error, nicknames: TNickname[]) => {
                                if (err)
                                    throw new Error(
                                        'Ошибка при получении данных',
                                    );
                                const nickname =
                                    nicknames[
                                        _.random(0, nicknames.length - 1, false)
                                    ].nickname;
                                const text = `Ты ${persDoc?.firstname} "${nickname}" ${persDoc?.lastname}!\n\nТвой патронус: <b>${patronus.name}</b>\n${patronus.title}`;
                                await ctx.replyWithHTML(text);
                                if (
                                    patronus.name ===
                                    'Просто здравствуй, просто как дела'
                                ) {
                                    await ctx.replyWithVideo({
                                        source: './public/videos/spidy.mp4',
                                    });
                                } else {
                                    const filePath = `./public/${patronus._id}.jpg`;
                                    if (existsSync(filePath)) {
                                        await ctx.replyWithPhoto({
                                            source: readFileSync(filePath),
                                        });
                                    }
                                }
                                await ctx.replyWithHTML(
                                    '<a href="https://t.me/kakul_podcast">Заглянуть на канал создателей</a>',
                                );
                            },
                        );
                    },
                );
            },
        );
    } catch (err) {
        console.error(err);
    }
}
