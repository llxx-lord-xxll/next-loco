#!/usr/bin/env node
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { Translator, TranslationService } from './translator.js';
import { MyMemoryService } from './services/mymemory.js';
import { DeepLService } from './services/deepl.js';
import { isDirectory } from './utils/file.js';
import chalk from 'chalk';
import { input, select, confirm } from '@inquirer/prompts';
import axios from 'axios';

dotenv.config();

const program = new Command();

program
    .name('next-loco')
    .description('Translate Next.js locale JSON files using MyMemory or DeepL')
    .version('1.2.1')
    .option('-i, --input <path>', 'Source locale file or directory (e.g., locales/en or locales/en.json)')
    .option('-o, --output <path>', 'Destination locale file or directory (e.g., locales/es or locales/es.json)')
    .option('-s, --service <service>', 'Translation service: mymemory or deepl')
    .option('-f, --from <lang>', 'Source language code')
    .option('-t, --to <lang>', 'Target language code')
    .action(async (options) => {
        try {
            console.log('\n' + chalk.bold.cyan('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
            console.log(chalk.bold.cyan('┃                                                  ┃'));
            console.log(chalk.bold.cyan('┃          🚀  Welcome to Next-Loco v1.2.1         ┃'));
            console.log(chalk.bold.cyan('┃       The Ultimate Locale Translation Tool       ┃'));
            console.log(chalk.bold.cyan('┃                                                  ┃'));
            console.log(chalk.bold.cyan('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));

            const isInputProvided = !!options.input;
            const isOutputProvided = !!options.output;
            const isServiceProvided = !!options.service;
            const isFromProvided = !!options.from;
            const isToProvided = !!options.to;

            const hasDeepLKey = !!process.env.DEEPL_API_KEY;

            let inputPath = options.input;
            if (!isInputProvided) {
                inputPath = await input({
                    message: chalk.magenta('📂 Enter source locale file or directory:'),
                    validate: (val) => val ? true : 'Input path is required'
                });
            }

            let outputPath = options.output;
            if (!isOutputProvided) {
                outputPath = await input({
                    message: chalk.magenta('📁 Enter destination locale file or directory:'),
                    validate: (val) => val ? true : 'Output path is required'
                });
            }

            let finalApiKey = process.env.DEEPL_API_KEY || '';

            let serviceType = options.service;
            if (!isServiceProvided) {
                serviceType = await select({
                    message: chalk.magenta('🛠  Select translation service:'),
                    choices: [
                        { name: 'MyMemory (Free, no API key required)', value: 'mymemory' },
                        {
                            name: hasDeepLKey ? 'DeepL (Premium, requires API key)' : 'DeepL (Premium, API key required 🔑)',
                            value: 'deepl'
                        }
                    ],
                    default: 'mymemory'
                });
            }

            if (serviceType === 'deepl') {
                while (!finalApiKey) {
                    console.log(chalk.blue.dim('\n💡 Tip: Save DEEPL_API_KEY in your .env or environment to skip this prompt.\n'));
                    finalApiKey = await input({
                        message: chalk.magenta('🔑 Enter your DeepL API Key:'),
                        validate: (val) => val ? true : 'DeepL API Key is required to use this service'
                    });

                    // Basic validation attempt
                    try {
                        // Lightweight test call (usage info)
                        await axios.get('https://api-free.deepl.com/v2/usage', {
                            headers: { 'Authorization': `DeepL-Auth-Key ${finalApiKey}` }
                        }).catch(async (err) => {
                            if (err.response?.status === 403) {
                                // Try pro URL if free fails with 403
                                await axios.get('https://api.deepl.com/v2/usage', {
                                    headers: { 'Authorization': `DeepL-Auth-Key ${finalApiKey}` }
                                });
                            } else {
                                throw err;
                            }
                        });
                        console.log(chalk.green('✔ DeepL API Key validated successfully!'));
                        // Set the validated key to process.env for DeepLService to pick it up
                        process.env.DEEPL_API_KEY = finalApiKey;
                    } catch (err: any) {
                        console.error(chalk.red(`\n✖ Invalid DeepL API Key: ${err.message}`));
                        const retry = await confirm({
                            message: chalk.yellow('Would you like to try another key? (Choosing "No" will switch to MyMemory)'),
                            default: true
                        });

                        if (!retry) {
                            console.log(chalk.yellow('Switching to MyMemory service...'));
                            serviceType = 'mymemory';
                            break;
                        }
                        finalApiKey = ''; // Clear to retry loop
                    }
                }
            }

            let fromLang = options.from;
            if (!isFromProvided) {
                fromLang = await input({
                    message: chalk.magenta('🌍 Enter source language code (e.g., en, ja, fr):'),
                    default: 'en'
                });
            }

            let toLang = options.to;
            if (!isToProvided) {
                toLang = await input({
                    message: chalk.magenta('🎯 Enter target language code (e.g., bn, es, de):'),
                    default: 'es'
                });
            }

            if (!isInputProvided || !isOutputProvided || !isServiceProvided || !isFromProvided || !isToProvided) {
                const ready = await confirm({
                    message: chalk.yellow('🔥 Ready to start translation?'),
                    default: true
                });

                if (!ready) {
                    console.log(chalk.yellow('\nOperation cancelled. See you next time! 👋\n'));
                    return;
                }
            }

            const finalOptions = {
                input: inputPath,
                output: outputPath,
                service: serviceType,
                from: fromLang,
                to: toLang
            };

            let service: TranslationService;

            if (finalOptions.service.toLowerCase() === 'deepl') {
                service = new DeepLService();
            } else if (finalOptions.service.toLowerCase() === 'mymemory') {
                service = new MyMemoryService();
            } else {
                console.error(chalk.red(`Error: Unsupported service "${finalOptions.service}"`));
                process.exit(1);
            }

            const translator = new Translator(service);
            if (isDirectory(finalOptions.input)) {
                await translator.translateDirectory(finalOptions.input, finalOptions.output, finalOptions.from, finalOptions.to);
            } else {
                await translator.translate(finalOptions.input, finalOptions.output, finalOptions.from, finalOptions.to);
            }

            console.log('\n' + chalk.bold.cyan('--------------------------------------------------'));
            console.log(chalk.bold('Developed by: Arifuzzaman Pranto'));
            console.log(chalk.dim('Github: https://github.com/llxx-lord-xxll'));
            console.log(chalk.dim('LinkedIn: https://www.linkedin.com/in/apranto/'));
            console.log(chalk.dim('Email: hello@pranto.me'));
            console.log(chalk.cyan('--------------------------------------------------\n'));
        } catch (error: any) {
            console.error(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

program.parse(process.argv);
