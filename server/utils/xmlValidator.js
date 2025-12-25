import libxmljs from 'libxmljs2';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to all XSD schema files
const schemaPaths = {
    note: join(__dirname, '..', 'schemas', 'note.xsd'),
    user: join(__dirname, '..', 'schemas', 'user.xsd'),
    notebook: join(__dirname, '..', 'schemas', 'notebook.xsd')
};

// Cache for parsed XSD documents
const xsdCache = {};

/**
 * Loads the XSD schema from file
 * @param {string} schemaType - The type of schema: 'note', 'user', or 'notebook'
 * @returns {object} The parsed XSD document
 */
function loadSchema(schemaType = 'note') {
    if (!schemaPaths[schemaType]) {
        throw new Error(`Unknown schema type: ${schemaType}. Valid types are: note, user, notebook`);
    }

    if (!xsdCache[schemaType]) {
        const xsdContent = readFileSync(schemaPaths[schemaType], 'utf-8');
        xsdCache[schemaType] = libxmljs.parseXml(xsdContent);
    }
    return xsdCache[schemaType];
}

/**
 * Validates XML content against an XSD schema
 * @param {string} xmlString - The XML string to validate
 * @param {string} schemaType - The type of schema: 'note', 'user', or 'notebook' (default: 'note')
 * @returns {object} Validation result with isValid boolean and errors array
 */
export function validateXML(xmlString, schemaType = 'note') {
    try {
        const xsd = loadSchema(schemaType);
        const xmlDoc = libxmljs.parseXml(xmlString);

        const isValid = xmlDoc.validate(xsd);

        if (isValid) {
            return { isValid: true, errors: [] };
        } else {
            const errors = xmlDoc.validationErrors.map(err => ({
                message: err.message,
                line: err.line,
                column: err.column
            }));
            return { isValid: false, errors };
        }
    } catch (error) {
        return {
            isValid: false,
            errors: [{ message: `XML parsing error: ${error.message}` }]
        };
    }
}

/**
 * Gets the XSD schema content as a string
 * @param {string} schemaType - The type of schema: 'note', 'user', or 'notebook' (default: 'note')
 * @returns {string} The XSD schema content
 */
export function getSchemaContent(schemaType = 'note') {
    if (!schemaPaths[schemaType]) {
        throw new Error(`Unknown schema type: ${schemaType}. Valid types are: note, user, notebook`);
    }
    return readFileSync(schemaPaths[schemaType], 'utf-8');
}

/**
 * Gets the path to an XSD schema file
 * @param {string} schemaType - The type of schema: 'note', 'user', or 'notebook' (default: 'note')
 * @returns {string} The absolute path to the XSD schema
 */
export function getSchemaPath(schemaType = 'note') {
    if (!schemaPaths[schemaType]) {
        throw new Error(`Unknown schema type: ${schemaType}. Valid types are: note, user, notebook`);
    }
    return schemaPaths[schemaType];
}

/**
 * Gets all available schema types
 * @returns {string[]} Array of available schema types
 */
export function getAvailableSchemas() {
    return Object.keys(schemaPaths);
}

export default { validateXML, getSchemaContent, getSchemaPath, getAvailableSchemas };
