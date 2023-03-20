import { setVisitor } from '@/database/database.hooks/setVisitor';
import { getGreeting } from '../bot.hooks/getGreeting';
import { getKeyboard } from '../bot.hooks/getKeyboard';
import type { NarrowedContext, Scenes } from 'telegraf';
import type { Update, Message } from 'telegraf/types';

export async function start(
    ctx: NarrowedContext<
        Scenes.SceneContext<Scenes.SceneSessionData>,
        Update.MessageUpdate<Message>
    >,
) {
    setVisitor(ctx.from.username, ctx.from.id);
    await ctx.reply(getGreeting(), {
        ...getKeyboard('greet'),
    });
}
