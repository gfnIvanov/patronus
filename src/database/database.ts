import Datastore from 'nedb';

export const db = {
    questions: new Datastore({ filename: 'database/questions.db' }),
    answers: new Datastore({ filename: 'database/answers.db' }),
    patronuses: new Datastore({ filename: 'database/patronuses.db' }),
    nicknames: new Datastore({ filename: 'database/nicknames.db' }),
    visitors: new Datastore({ filename: 'database/visitors.db' }),
};
