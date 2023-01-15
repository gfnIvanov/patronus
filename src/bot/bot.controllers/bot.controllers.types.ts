import type { TQuestion } from '@/database/database.types';

export type TQuestionData = {
    [x: string]: {
        idx: number[];
        data: TQuestion[];
    };
};

export type TQuestionsIdx = {
    [x: string]: {
        idx: Set<unknown>;
    };
};

export type TAnswers = {
    [x: string]: {
        list: string[];
    };
};
