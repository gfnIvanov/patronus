export type TPatronuses = {
    name: string;
    title: string;
    character: string;
    _id: string;
};

export type TNickname = {
    nickname: string;
};

export type TQuestion = {
    question: string;
    _id: string;
};

export type TAnswer = {
    answer: string;
    character: string;
    question: string;
    _id: string;
};

export type TVisitors = {
    username: string;
    _id: string;
};
