import axios from 'axios';
import { TranslationService } from '../translator.js';

export class MyMemoryService implements TranslationService {
    name = 'MyMemory';

    async translateBatch(texts: string[], from: string, to: string): Promise<string[]> {
        const results: string[] = [];

        for (const text of texts) {
            try {
                const email = process.env.MYMEMORY_EMAIL;
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}${email ? `&de=${email}` : ''}`;

                const response = await axios.get(url);
                const data = response.data as any;

                if (data && data.responseData) {
                    results.push(data.responseData.translatedText);
                } else {
                    results.push(text); // Fallback to original
                }
            } catch (error) {
                console.error(`MyMemory translation failed for: "${text}"`, error);
                results.push(text);
            }
        }

        return results;
    }
}
