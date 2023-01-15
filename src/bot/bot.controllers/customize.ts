import type { NarrowedContext, Scenes } from 'telegraf';
import type { Update, Message } from 'telegraf/types';
import { getKeyboard } from '../bot.hooks/getKeyboard';
import { admins } from '@/configs/admins';

export async function customize(
    ctx: NarrowedContext<
        Scenes.SceneContext<Scenes.SceneSessionData>,
        Update.MessageUpdate<Message>
    >,
) {
    if (admins.includes(ctx.from.username as string)) {
        await ctx.reply('⚙️', {
            ...getKeyboard('custom'),
        });
    } else {
        await ctx.reply(
            'Тайная комната закрыта, колдуй /start и тебя будет ждать успех!',
        );
    }
}
