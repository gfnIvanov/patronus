#!/usr/bin/env node

import { program } from 'commander';
import { find, update } from './actions/update.mjs';

program.on('--help', () => {
    console.group('\nfind');
    console.log('Команда для поиска объектов в БД');
    console.log('--type - тип объекта (patronus|question|answer)');
    console.log(
        '--name - наименование (ввести часть наименования в одинарных кавычках, регистр не важен)',
    );
    console.groupEnd();
    console.group('upd');
    console.log('Команда для обновления объектов в БД');
    console.log('--type - тип объекта (patronus|question|answer)');
    console.log('--id - идентификатор объекта');
    console.log(
        '--field - обновляемое поле (name|title|character|question|answer)',
    );
    console.log('--new - новое значение для поля (в одинарных кавычках)');
    console.groupEnd();
});

program
    .command('find')
    .option('--type <type>')
    .option('--name <name>')
    .action(find);

program
    .command('upd')
    .option('--type <type>')
    .option('--id <id>')
    .option('--field <field>')
    .option('--new <new>')
    .action(update);

program.parse(process.argv);
