import axios from 'axios';
import { TranslationService } from '../translator.js';

export class DeepLService implements TranslationService {
    name = 'DeepL';
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.DEEPL_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('DEEPL_API_KEY environment variable is required for DeepL service.');
        }
        // Check if it's a free or pro key
        this.apiUrl = this.apiKey.endsWith(':fx')
            ? 'https://api-free.deepl.com/v2/translate'
            : 'https://api.deepl.com/v2/translate';
    }

    async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
        try {
            const response = await axios.post(
                this.apiUrl,
                new URLSearchParams({
                    auth_key: this.apiKey,
                    source_lang: from.toUpperCase(),
                    target_lang: to.toUpperCase(),
                    ...texts.reduce((acc, text, i) => ({ ...acc, [`text[${i}]`]: text }), {})
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return (response.data as any).translations.map((t: any) => t.text);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message;
            throw new Error(`DeepL translation failed: ${message}`);
        }
    }
}
