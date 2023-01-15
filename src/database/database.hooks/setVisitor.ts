import { db } from '../database';
import type { TVisitors } from '../database.types';

export function setVisitor(username: string) {
    db.visitors.find({ username }, (err: Error, data: TVisitors[]) => {
        if (err) throw new Error('Ошибка при получении данных');
        if (data.length === 0) {
            db.visitors.insert({ username });
        }
    });
}
