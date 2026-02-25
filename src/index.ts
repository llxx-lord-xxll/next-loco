#!/usr/bin/env node
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { Translator, TranslationService } from './translator.js';
import { MyMemoryService } from './services/mymemory.js';
import { DeepLService } from './services/deepl.js';
import chalk from 'chalk';

dotenv.config();

const program = new Command();

program
    .name('next-loco')
    .description('Translate Next.js locale JSON files using MyMemory or DeepL')
    .version('1.0.0')
    .requiredOption('-i, --input <path>', 'Source locale file (e.g., locales/en.json)')
    .requiredOption('-o, --output <path>', 'Destination locale file (e.g., locales/es.json)')
    .option('-s, --service <service>', 'Translation service: mymemory or deepl', 'mymemory')
    .option('-f, --from <lang>', 'Source language code', 'en')
    .option('-t, --to <lang>', 'Target language code', 'es')
    .action(async (options) => {
        let service: TranslationService;

        try {
            if (options.service.toLowerCase() === 'deepl') {
                service = new DeepLService();
            } else if (options.service.toLowerCase() === 'mymemory') {
                service = new MyMemoryService();
            } else {
                console.error(chalk.red(`Error: Unsupported service "${options.service}"`));
                process.exit(1);
            }

            const translator = new Translator(service);
            await translator.translate(options.input, options.output, options.from, options.to);

            console.log('\n' + chalk.bold.cyan('--------------------------------------------------'));
            console.log(chalk.bold('Developed by [User] in collaboration with innoline.tech'));
            console.log(chalk.cyan('--------------------------------------------------'));
            console.log(chalk.yellow('If you find this tool helpful, please consider donating!'));
            console.log(chalk.dim('Your support helps us maintain and improve this project.'));
            console.log(chalk.blue('Donation Link: [Your Donation Link Here]'));
            console.log(chalk.bold.cyan('--------------------------------------------------\n'));
        } catch (error: any) {
            console.error(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

program.parse(process.argv);
