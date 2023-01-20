import { readFileSync, writeFileSync } from 'node:fs';
import { db } from '../../build/database/database.js';

export const find = command => setContext('find')(command.type)(command);

export const update = command => setContext('update')(command.type)(command);

function setContext(action) {
    return type => {
        try {
            if (
                type !== 'patronus' &&
                type !== 'question' &&
                type !== 'answer'
            ) {
                throw new Error(
                    'Ожидаемый тип объекта не получен, допустимые типы: patronus, question, answer',
                );
            }
            let object;
            if (action === 'find') {
                object = new Map([
                    [
                        'patronus',
                        {
                            init: () => db.patronuses.loadDatabase(),
                            action: (...args) => db.patronuses.find(...args),
                            field: 'name',
                            err: 'Ошибка при поиске патронуса',
                        },
                    ],
                    [
                        'question',
                        {
                            init: () => db.questions.loadDatabase(),
                            action: (...args) => db.questions.find(...args),
                            field: 'question',
                            err: 'Ошибка при поиске вопроса',
                        },
                    ],
                    [
                        'answer',
                        {
                            init: () => db.answers.loadDatabase(),
                            action: (...args) => db.answers.find(...args),
                            field: 'answer',
                            err: 'Ошибка при поиске варианта ответа',
                        },
                    ],
                ]).get(type);
            } else {
                object = new Map([
                    [
                        'patronus',
                        {
                            init: () => db.patronuses.loadDatabase(),
                            action: (...args) => db.patronuses.insert(...args),
                            file: './database/patronuses.db',
                            res: 'Патронус успешно обновлен!',
                            err: 'Ошибка при обновлении патронуса',
                        },
                    ],
                    [
                        'question',
                        {
                            init: () => db.questions.loadDatabase(),
                            action: (...args) => db.questions.insert(...args),
                            file: './database/questions.db',
                            res: 'Вопрос успешно обновлен!',
                            err: 'Ошибка при обновлении вопроса',
                        },
                    ],
                    [
                        'answer',
                        {
                            init: () => db.answers.loadDatabase(),
                            action: (...args) => db.answers.insert(...args),
                            file: './database/answers.db',
                            res: 'Вариант ответа успешно обновлен!',
                            err: 'Ошибка при обновлении варианта ответа',
                        },
                    ],
                ]).get(type);
            }
            return args => {
                const callback = (err, res) => {
                    if (err || res.length === 0) throw new Error(object.err);
                    console.log(object.res || res);
                };
                object.init();
                if (action === 'find') {
                    const findOpt = {};
                    findOpt[object.field] = {
                        $regex: new RegExp(`^${args.name}`, 'i'),
                    };
                    object.action(findOpt, callback);
                } else {
                    const newData = prepareFile(object, args.id);
                    newData[args.field] = args.new;
                    object.action(newData, callback);
                }
            };
        } catch (err) {
            console.error(err);
        }
    };
}

function prepareFile(object, id) {
    let currentData;
    const newData = readFileSync(object.file)
        .toString()
        .split('\n')
        .filter(line => !!line)
        .map(data => {
            const str = JSON.parse(data);
            if (str._id === id) {
                currentData = str;
            } else {
                return data;
            }
        });
    writeFileSync(object.file, newData.join('\n'));
    return currentData;
}
