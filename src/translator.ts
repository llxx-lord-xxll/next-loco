import { readLocaleFile, writeLocaleFile } from './utils/file.js';
import ora from 'ora';
import chalk from 'chalk';

export interface TranslationService {
    name: string;
    translateBatch(texts: string[], from: string, to: string): Promise<string[]>;
}

export class Translator {
    constructor(private service: TranslationService) { }

    async translate(inputPath: string, outputPath: string, from: string, to: string) {
        const spinner = ora(chalk.blue(`Reading locale file: ${inputPath}`)).start();

        try {
            const flattenedData = readLocaleFile(inputPath);
            const keys = Object.keys(flattenedData);
            const values = Object.values(flattenedData);

            const totalStrings = values.length;
            spinner.text = chalk.blue(`Translating 0/${totalStrings} strings using ${this.service.name}...`);

            const translatedValues = await this.batchTranslate(values, from, to, (current) => {
                spinner.text = chalk.blue(`Translating ${current}/${totalStrings} strings using ${this.service.name}...`);
            });

            const translatedData: Record<string, string> = {};
            keys.forEach((key, index) => {
                const val = translatedValues[index];
                if (val !== undefined) {
                    translatedData[key] = val;
                }
            });

            spinner.text = chalk.blue(`Writing translated file: ${outputPath}`);
            writeLocaleFile(outputPath, translatedData);

            spinner.succeed(chalk.green(`Successfully translated ${totalStrings} strings to ${to} and saved to ${outputPath}`));
        } catch (error: any) {
            spinner.fail(chalk.red(`Translation failed: ${error.message}`));
            process.exit(1);
        }
    }

    private async batchTranslate(
        texts: string[],
        from: string,
        to: string,
        onProgress: (current: number) => void
    ): Promise<string[]> {
        const BATCH_SIZE = 50; // API limits safety
        const results: string[] = [];

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            const translatedBatch = await this.service.translateBatch(batch, from, to);
            results.push(...translatedBatch);
            onProgress(results.length);
        }

        return results;
    }
}
