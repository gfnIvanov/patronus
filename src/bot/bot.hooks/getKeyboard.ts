import { Markup } from 'telegraf';

const keyboardTypes = new Map([
    ['greet', [Markup.button.callback('Клянусь!', 'getQuestions')]],
    [
        'custom',
        [
            Markup.button.callback('Добавить вопрос', 'addQuestion'),
            Markup.button.callback('Добавить патронуса', 'addPatronus'),
            Markup.button.callback(
                'Добавить прозвище персонажа',
                'addNickname',
            ),
            Markup.button.callback(
                'Посмотреть всех патронусов',
                'getPatronuses',
            ),
            Markup.button.callback('Посмотреть все прозвища', 'getNicknames'),
            Markup.button.callback('Посмотреть посетителей', 'getVisitors'),
        ],
    ],
]);

export function getKeyboard(type: string) {
    return Markup.inlineKeyboard(keyboardTypes.get(type) ?? [], { columns: 1 });
}
