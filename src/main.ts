import { bot } from '@/bot/bot';
import { db } from '@/database/database';

bot.launch();

db.questions.loadDatabase();

db.answers.loadDatabase();

db.patronuses.loadDatabase();

db.nicknames.loadDatabase();

db.visitors.loadDatabase();
