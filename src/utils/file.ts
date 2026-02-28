import * as fs from 'fs';
import * as path from 'path';

/**
 * Flattens a nested JSON object into a single-level object with dot-notation keys.
 */
export function flattenObject(obj: any, prefix = ''): Record<string, string> {
  let flattened: Record<string, string> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], propName));
      } else {
        flattened[propName] = String(obj[key]);
      }
    }
  }

  return flattened;
}

/**
 * Unflattens a dot-notation object back into a nested JSON structure.
 */
export function unflattenObject(data: Record<string, string>): any {
  const result: any = {};

  for (const key in data) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i] as string;
      if (i === parts.length - 1) {
        current[part] = data[key];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }

  return result;
}

/**
 * Reads a JSON file and flattens it.
 */
export function readLocaleFile(filePath: string): Record<string, string> {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const json = JSON.parse(content);
  return flattenObject(json);
}

/**
 * Writes a flattened object back to a file as a nested JSON structure.
 */
export function writeLocaleFile(filePath: string, data: Record<string, string>): void {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const nested = unflattenObject(data);
  fs.writeFileSync(absolutePath, JSON.stringify(nested, null, 2), 'utf-8');
}

/**
 * Checks if a path is a directory.
 */
export function isDirectory(filePath: string): boolean {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory();
}

/**
 * Gets all JSON files in a directory and its subdirectories.
 */
export function getJsonFilesRecursively(dir: string, baseDir = dir): string[] {
  const absoluteDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  const files = fs.readdirSync(absoluteDir);
  let jsonFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(absoluteDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      jsonFiles = jsonFiles.concat(getJsonFilesRecursively(fullPath, baseDir));
    } else if (file.endsWith('.json')) {
      // Return relative path from baseDir
      jsonFiles.push(path.relative(baseDir, fullPath));
    }
  }

  return jsonFiles;
}
