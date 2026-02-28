import { readLocaleFile, writeLocaleFile, getJsonFilesRecursively } from './utils/file.js';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

export interface TranslationService {
    name: string;
    translateBatch(texts: string[], from: string, to: string): Promise<string[]>;
}

export class Translator {
    constructor(private service: TranslationService) { }

    async translate(inputPath: string, outputPath: string, from: string, to: string) {
        const spinner = ora(chalk.blue(`Reading locale file: ${inputPath}`)).start();

        try {
            await this.translateFile(inputPath, outputPath, from, to, (message) => {
                spinner.text = chalk.blue(message);
            });
            spinner.succeed(chalk.green(`Successfully translated ${inputPath} to ${to} and saved to ${outputPath}`));
        } catch (error: any) {
            spinner.fail(chalk.red(`Translation failed: ${error.message}`));
            process.exit(1);
        }
    }

    async translateDirectory(inputDir: string, outputDir: string, from: string, to: string) {
        const jsonFiles = getJsonFilesRecursively(inputDir);
        const totalFiles = jsonFiles.length;

        if (totalFiles === 0) {
            console.log(chalk.yellow(`No JSON files found in directory: ${inputDir}`));
            return;
        }

        const mainSpinner = ora(chalk.bold.blue(`Batch translating ${totalFiles} files from ${inputDir} to ${outputDir}...`)).start();

        try {
            for (let i = 0; i < jsonFiles.length; i++) {
                const relPath = jsonFiles[i] as string;
                const inputPath = path.join(inputDir, relPath);
                const outputPath = path.join(outputDir, relPath);

                await this.translateFile(inputPath, outputPath, from, to, (message) => {
                    mainSpinner.text = chalk.blue(`[${i + 1}/${totalFiles}] ${message} (${relPath})`);
                });
            }

            mainSpinner.succeed(chalk.green(`Successfully batch translated ${totalFiles} files to ${outputDir}`));
        } catch (error: any) {
            mainSpinner.fail(chalk.red(`Batch translation failed: ${error.message}`));
            process.exit(1);
        }
    }

    private async translateFile(
        inputPath: string,
        outputPath: string,
        from: string,
        to: string,
        onProgress: (message: string) => void
    ) {
        const flattenedData = readLocaleFile(inputPath);
        const keys = Object.keys(flattenedData);
        const values = Object.values(flattenedData);

        const totalStrings = values.length;
        if (totalStrings === 0) return;

        const translatedValues = await this.batchTranslate(values, from, to, (current) => {
            onProgress(`Translating ${current}/${totalStrings} strings using ${this.service.name}...`);
        });

        const translatedData: Record<string, string> = {};
        keys.forEach((key, index) => {
            const val = translatedValues[index];
            if (val !== undefined) {
                translatedData[key] = val;
            }
        });

        writeLocaleFile(outputPath, translatedData);
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
