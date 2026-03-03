# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-03

### Fixed
- **Nested JSON Handling**: Fixed a critical issue where arrays of objects and arrays of strings were not being preserved during translation. The tool now correctly recurses into arrays and reconstructs them in the output files.

## [1.1.0] - 2026-02-28

### Added
- **Batch Folder Translation**: Support for translating entire directories. Preserves the original hierarchical structure in the output directory.
- **Interactive CLI Wizard**: A user-friendly "wizardly" prompt system powered by `@inquirer/prompts`.
  - Automatically prompts for missing parameters (input, output, service, languages).
  - Premium welcome banner and color-coded prompts.
  - Final confirmation step before starting translation.
- **Dynamic DeepL Key Prompting**: If `DEEPL_API_KEY` is missing from the environment, the wizard prompts for it at runtime.
- **Real-time API Key Validation**: DeepL API keys are validated via a lightweight usage check during the wizard flow.
- **Fallback Logic**: Seamlessly switch to MyMemory if a valid DeepL key is not available.

### Changed
- **DeepL Authentication**: Updated to the latest header-based authentication (`Authorization: DeepL-Auth-Key [key]`). Legacy form-body authentication is no longer used.
- **Commander Options**: Changed required options to optional to support the interactive wizard flow.
- **Improved UX**: Enhanced CLI feedback with `ora` spinners and `chalk` colors.

### Fixed
- Fixed an issue where the tool would fail if no flags were provided.
- Resolved `axios is not defined` error during DeepL key validation.
- Fixed TypeScript compilation errors related to property initialization in `DeepLService`.

## [1.0.0] - 2026-02-25

### Added
- Initial release.
- Support for Single File Translation (JSON).
- Nested JSON structure handling.
- MyMemory and DeepL (Free/Pro) integration.
- Batch translation for large files.
