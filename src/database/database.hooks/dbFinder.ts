import type { Cursor } from 'nedb';
import { db } from '../database';
import type { TNickname, TPatronuses, TVisitors } from '../database.types';

const dbActions = new Map([
    ['getPatronuses', db.patronuses.find({})],
    ['getNicknames', db.nicknames.find({})],
    ['getVisitors', db.visitors.find({})],
]);

export function dbFinder(action: string) {
    return dbActions.get(action) as Cursor<TPatronuses & TNickname & TVisitors>;
}
