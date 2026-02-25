# Next-Loco Translator

A powerful, npx-ready CLI tool to translate Next.js locale JSON files using MyMemory or DeepL. It handles nested JSON structures and uses efficient batching for large files.

## Features

- **Nested JSON Support**: Flattens nested keys for translation and reconstructs the structure back.
- **Service Options**: Choose between MyMemory (free) and DeepL (requires API key).
- **Efficient Batching**: Translates many strings in batches to optimize API usage.
- **Easy Setup**: Minimal configuration via environment variables.

## Installation

You can run it directly using `npx`:

```bash
npx next-loco -i ./locales/en.json -o ./locales/es.json -s mymemory -f en -t es
```

## Configuration

Service-specific configurations are handled via environment variables:

- `DEEPL_API_KEY`: Required if using the DeepL service.
- `MYMEMORY_EMAIL`: Optional for MyMemory to increase rate limits.

You can create a `.env` file in your root:

```env
DEEPL_API_KEY=your_key_here
MYMEMORY_EMAIL=your_email@example.com
```

## CLI Usage

```bash
next-loco [options]

Options:
  -v, --version           output the version number
  -i, --input <path>      Source locale file (e.g., locales/en.json)
  -o, --output <path>     Destination locale file (e.g., locales/es.json)
  -s, --service <service> Translation service: mymemory or deepl (default: "mymemory")
  -f, --from <lang>       Source language code (default: "en")
  -t, --to <lang>         Target language code (default: "es")
  -h, --help              display help for command
```

## Examples

### Using MyMemory (Free)
```bash
npx next-loco -i locales/en.json -o locales/fr.json -s mymemory -f en -t fr
```

### Using DeepL (API Key Required)
```bash
npx next-loco -i locales/en.json -o locales/de.json -s deepl -f en -t de
```

## Credits

Developed by **[User]** in collaboration with **[innoline.tech](https://innoline.tech)**.

## Support & Donation

If you find this tool helpful, please consider supporting the development. Your donations help us maintain and improve the project!

- **Buy Me a Coffee**: [Link to Donation/Support]
- **innoline.tech**: [Support via innoline.tech]

> [!TIP]
> Your support keeps this project alive and free for everyone!

