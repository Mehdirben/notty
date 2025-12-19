import libxmljs from 'libxmljs2';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the XSD schema file
const schemaPath = join(__dirname, '..', 'schemas', 'note.xsd');

// Load and parse the XSD schema
let xsdDoc = null;

/**
 * Loads the XSD schema from file
 * @returns {object} The parsed XSD document
 */
function loadSchema() {
    if (!xsdDoc) {
        const xsdContent = readFileSync(schemaPath, 'utf-8');
        xsdDoc = libxmljs.parseXml(xsdContent);
    }
    return xsdDoc;
}

/**
 * Validates XML content against the note XSD schema
 * @param {string} xmlString - The XML string to validate
 * @returns {object} Validation result with isValid boolean and errors array
 */
export function validateXML(xmlString) {
    try {
        const xsd = loadSchema();
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
 * @returns {string} The XSD schema content
 */
export function getSchemaContent() {
    return readFileSync(schemaPath, 'utf-8');
}

/**
 * Gets the path to the XSD schema file
 * @returns {string} The absolute path to the XSD schema
 */
export function getSchemaPath() {
    return schemaPath;
}

export default { validateXML, getSchemaContent, getSchemaPath };
