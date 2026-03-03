# Next-Loco Translator v1.2.0

A powerful, npx-ready CLI tool to translate Next.js locale JSON files using MyMemory or DeepL. It handles nested JSON structures, supports batch folder translation, uses efficient batching for large files, and features an interactive wizard for a seamless experience.

## Features

- **Nested JSON Support**: Flattens nested keys for translation and reconstructs the structure back.
- **Batch Folder Translation**: Translate an entire directory of locale files while preserving the folder hierarchy.
- **Interactive CLI Wizard**: Run without parameters to be guided through the setup with a user-friendly wizard.
- **Dynamic API Key Validation**: Prompts for and validates DeepL API keys at runtime if not found in environment.
- **Efficient Batching**: Translates many strings in batches to optimize API usage and handle large files efficiently.
- **Service Options**: Choose between MyMemory (free) and DeepL (requires API key).

## Installation & Quick Start

You can run it directly using `npx`:

```bash
npx next-loco
```

Just run the command, and the **Next-Loco Wizard** will guide you through the process! ✨

### CLI Usage (Advanced)

```bash
npx next-loco [options]

Options:
  -v, --version           output the version number
  -i, --input <path>      Source locale file or directory (e.g., locales/en)
  -o, --output <path>     Destination locale file or directory (e.g., locales/bn)
  -s, --service <service> Translation service: mymemory or deepl
  -f, --from <lang>       Source language code (e.g., en)
  -t, --to <lang>         Target language code (e.g., bn)
  -h, --help              display help for command
```

## Folder Translation

Next-Loco now supports translating entire directories. This is perfect for Next.js projects with multiple locale files:

```bash
npx next-loco -i ./locales/en -o ./locales/bn
```

The tool will find all `.json` files recursively and reproduce the structure in the destination folder.

## Configuration

Service-specific configurations can be pre-configured via environment variables to skip prompts:

- `DEEPL_API_KEY`: Your DeepL API key.
- `MYMEMORY_EMAIL`: Optional for MyMemory to increase rate limits.

You can create a `.env` file in your root:

```env
DEEPL_API_KEY=your_key_here
MYMEMORY_EMAIL=your_email@example.com
```

## Credits

- **Developer**: Arifuzzaman Pranto
- **Github**: [https://github.com/llxx-lord-xxll](https://github.com/llxx-lord-xxll)
- **LinkedIn**: [https://www.linkedin.com/in/apranto/](https://www.linkedin.com/in/apranto/)
- **Email**: [hello@pranto.me](mailto:hello@pranto.me)

In collaboration with **[innoline.tech](https://innoline.tech)**.

> [!TIP]
> Your support keeps this project alive and free for everyone!
