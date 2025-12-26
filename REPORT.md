# Notty - Modern Note-Taking Platform

## Technical Project Report

> Your Ideas, Beautifully Organized

| Aspect           | Details                            |
| ---------------- | ---------------------------------- |
| **Technologies** | React, Node.js, Express, MongoDB   |
| **Architecture** | Full-Stack with Docker             |
| **Deployment**   | Coolify / Docker Compose           |

---

## Table of Contents

- [Part I: Cahier de Charge](#part-i-cahier-de-charge)
  - [Introduction](#introduction)
  - [Functional Requirements](#functional-requirements)
  - [Non-Functional Requirements](#non-functional-requirements)
- [Part II: XML XSD / Conception](#part-ii-xml-xsd--conception)
  - [Introduction to XML](#introduction-to-xml)
  - [XML Data Architecture](#xml-data-architecture)
  - [XSD Schema Definition](#xsd-schema-definition)
  - [XML Validation](#xml-validation)
  - [Data Models](#data-models)
- [Part III: Technologies](#part-iii-technologies)
  - [Technology Selection Philosophy](#technology-selection-philosophy)
  - [Frontend Technologies](#frontend-technologies)
  - [Backend Technologies](#backend-technologies)
- [Part IV: Application](#part-iv-application)
  - [REST API](#rest-api)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Deployment](#deployment)
  - [Screenshots](#screenshots)
  - [Installation](#installation)
  - [Security Considerations](#security-considerations)
  - [Conclusion](#conclusion)

---

## Part I: Cahier de Charge

## Introduction

### Project Overview

**Notty** is a modern note-taking platform designed to provide a smooth and feature-rich user experience. This full-stack web application allows users to create, organize, and manage their notes intuitively with a rich text editor.

The application is built with a modern architecture that clearly separates the frontend from the backend, facilitating maintenance, scalability, and independent deployment of each component.

In today's digital age, note-taking has evolved from simple text files to sophisticated platforms that support rich formatting, collaboration, and cross-device synchronization. Notty addresses the need for a self-hosted, privacy-focused alternative to commercial solutions like Notion or Evernote.

### Project Objectives

- **Ease of use**: Intuitive interface with dark mode support
- **Productivity**: Rich editor with keyboard shortcuts and auto-save
- **Organization**: Customizable notebook system with icons and colors
- **Security**: JWT authentication with secure session management
- **Flexible deployment**: Docker and Coolify support for easy deployment

### Target Audience

The Notty application is designed for:

- Students who need to organize their course notes
- Professionals requiring a productivity tool for meetings and projects
- Writers and content creators who need a distraction-free writing environment
- Developers who prefer self-hosted solutions with full data control
- Anyone seeking a modern, intuitive note-taking solution

---

## Functional Requirements

### Authentication System

**User Registration:**

- Users must be able to create an account with name, email, and password
- Email addresses must be unique across the system
- Passwords must be securely hashed before storage using bcrypt algorithm

**User Login & Session Management:**

- JWT-based authentication (JSON Web Tokens) for stateless session management
- Token expiration is configurable (default: 7 days)
- Automatic redirection to login on token expiration
- Secure token storage in browser's local storage

### Notebook Management

- Create multiple notebooks to organize notes by topic, project, or category
- Customization with emoji icons (notebook, briefcase, lightbulb, etc.)
- Custom color assignment for visual distinction and quick recognition
- Hierarchical content organization with notebooks containing multiple notes
- CRUD operations (Create, Read, Update, Delete) for full notebook lifecycle management

### Rich Text Editor

The editor uses **TipTap**, a headless, framework-agnostic rich text editor built on top of ProseMirror. TipTap was chosen because it offers:

- Full control over the UI while providing robust editing functionality
- Extensible architecture allowing custom extensions
- Excellent React integration with hooks and components
- Active community and regular updates

**Editor Features:**

- **Basic formatting**: Bold, italic, strikethrough, underline
- **Headings**: H1, H2, H3 for document structure
- **Lists**: Bullet and numbered lists for organized content
- **Task lists**: Checkboxes for todo tracking and task management
- **Code blocks**: Syntax highlighting with Highlight.js for developer-friendly notes
- **Images**: Upload and image integration for visual content
- **Links**: Hyperlink creation and management for external references

### Advanced Features

| Feature       | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| ⭐ Favorites  | Mark important notes for quick access from a dedicated favorites view  |
| 📌 Pin        | Pin notes to the top of the list for immediate visibility              |
| 🔍 Search     | Global search (Cmd/Ctrl+K) across all notes and notebooks              |
| 🌙 Dark Mode  | Elegant dark theme by default, reducing eye strain                     |
| 💾 Auto-save  | Automatic saving while typing, preventing data loss                    |
| 📱 Responsive | Desktop and mobile compatible responsive design                        |

---

## Non-Functional Requirements

### Performance & Scalability

- Page load time should be under 3 seconds on standard connections
- API response time should be under 500ms for standard CRUD operations
- Editor should handle documents up to 50,000 characters without performance degradation
- Architecture supports horizontal scaling through Docker containerization
- Stateless API design enables load balancing across multiple instances

### Security Requirements

- HTTPS required in production for encrypted data transmission
- Passwords hashed using bcrypt with salt rounds for secure storage
- JWT tokens for stateless authentication with configurable expiration
- Input validation on all API endpoints using express-validator
- CORS configuration to prevent unauthorized cross-origin access
- XSS protection through proper content sanitization

---

## Part II: XML XSD / Conception

## Introduction to XML

### What is XML?

**XML (eXtensible Markup Language)** is a markup language and file format designed to store and transport data. Unlike HTML which focuses on displaying data, XML focuses on describing and structuring data in a way that is both human-readable and machine-readable.

**Key characteristics of XML:**

- **Self-descriptive**: XML documents contain both data and metadata (tags) that describe the data
- **Extensible**: Users can define their own tags and document structure
- **Platform-independent**: XML can be read and processed on any operating system
- **Unicode support**: XML supports international character sets
- **Hierarchical structure**: Data is organized in a tree-like parent-child relationship

**Example of XML structure:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<library>
    <book id="1">
        <title>Learning XML</title>
        <author>John Doe</author>
        <year>2024</year>
    </book>
</library>
```

### What is XSD?

**XSD (XML Schema Definition)** is a W3C recommendation that specifies how to formally describe the elements in an XML document. XSD defines the structure, content, and semantics of XML documents, acting as a contract that XML documents must follow.

**Key features of XSD:**

- **Data types**: XSD supports primitive types (string, integer, date) and allows custom types
- **Constraints**: Define minimum/maximum occurrences, patterns, and value restrictions
- **Namespaces**: Support for XML namespaces to avoid element name conflicts
- **Documentation**: Built-in annotation elements for schema documentation
- **Validation**: Enables automatic validation of XML documents against the schema

### Why Choose XML and XSD for Notty?

The decision to implement XML/XSD in Notty was driven by several important considerations:

1. **Data Portability**: XML is a universal format that can be read by virtually any programming language or platform.

2. **Data Integrity**: XSD validation ensures that all notes follow a consistent structure. Invalid data is rejected before it enters the system, preventing data corruption.

3. **Interoperability**: Organizations often need to exchange data between different systems. XML provides a standardized format for such exchanges.

4. **Long-term Preservation**: XML is a text-based format that will remain readable for decades, unlike proprietary binary formats that may become obsolete.

5. **Human Readability**: Unlike JSON or binary formats, XML with proper indentation is easy to read and debug manually.

6. **Industry Standard**: XML/XSD is widely used in enterprise environments, making Notty compatible with corporate workflows.

---

## XML Data Architecture

### Data Flow

```text
┌─────────────────┐       JSON        ┌─────────────────┐
│   Note Editor   │ ───────────────▶  │  MongoDB Store  │
│    (TipTap)     │                   │   (content)     │
└────────┬────────┘                   └─────────────────┘
         │
         │  xml2js
         ▼
┌─────────────────┐      Validate     ┌─────────────────┐
│  XML Generation │ ───────────────▶  │   XSD Schema    │
│   (xml2js)      │    (libxmljs2)    │   (note.xsd)    │
└────────┬────────┘                   └─────────────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Store  │
│  (contentXML)   │
└─────────────────┘
```

**Process explanation:**

1. User creates/edits a note in the TipTap editor
2. Content is saved as JSON in MongoDB for fast retrieval
3. Simultaneously, the `xml2js` library converts the content to XML format
4. The XML is validated against the XSD schema using `libxmljs2`
5. If valid, the XML representation is also stored in MongoDB

---

## XML Note Structure

Each note is converted to XML with the following structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <title>Meeting Notes - Q4 Planning</title>
  <content>
    <h1>Quarterly Planning Meeting</h1>
    <p>Discussed project timelines and resource allocation.</p>
    <ul>
      <li>Budget review completed</li>
      <li>New hires approved</li>
    </ul>
  </content>
  <createdAt>2025-12-19T10:00:00.000Z</createdAt>
  <updatedAt>2025-12-19T10:30:00.000Z</updatedAt>
  <tags>
    <tag>work</tag>
    <tag>meeting</tag>
    <tag>planning</tag>
  </tags>
</note>
```

---

## XSD Schema Definition

### Complete Schema

The XSD schema (`server/schemas/note.xsd`) defines the complete structure and constraints:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           elementFormDefault="qualified"
           attributeFormDefault="unqualified">
  
  <!-- Root element definition -->
  <xs:element name="note" type="NoteType"/>
  
  <!-- NoteType: defines the structure of a note -->
  <xs:complexType name="NoteType">
    <xs:all>
      <!-- Title is required, max 200 characters -->
      <xs:element name="title" minOccurs="1">
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:maxLength value="200"/>
          </xs:restriction>
        </xs:simpleType>
      </xs:element>
      
      <!-- Content is required but can be empty -->
      <xs:element name="content" type="xs:string" minOccurs="1"/>
      
      <!-- Timestamps are optional, ISO 8601 format -->
      <xs:element name="createdAt" type="xs:string" minOccurs="0"/>
      <xs:element name="updatedAt" type="xs:string" minOccurs="0"/>
      
      <!-- Tags container is optional -->
      <xs:element name="tags" type="TagsType" minOccurs="0"/>
    </xs:all>
  </xs:complexType>
  
  <!-- TagsType: list of tag elements -->
  <xs:complexType name="TagsType">
    <xs:sequence>
      <xs:element name="tag" type="xs:string" 
                  minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
  
</xs:schema>
```

### Schema Elements Reference

| Element     | Type      | Required | Description                                |
| ----------- | --------- | -------- | ------------------------------------------ |
| `note`      | NoteType  | Yes      | Root element containing all note data      |
| `title`     | xs:string | Yes      | Note title, maximum 200 characters         |
| `content`   | xs:string | Yes      | Rich text content in HTML format           |
| `createdAt` | xs:string | No       | Creation timestamp in ISO 8601 format      |
| `updatedAt` | xs:string | No       | Last modification timestamp                |
| `tags`      | TagsType  | No       | Container element for categorization tags  |
| `tag`       | xs:string | No       | Individual tag, unlimited quantity allowed |

---

## XML Validation

### Implementation

The validation is performed using **libxmljs2**, a high-performance Node.js binding for the libxml2 C library. This choice provides:

- Native performance through C bindings
- Full XSD 1.0 compliance
- Detailed error messages with line numbers
- Memory-efficient processing of large documents

```javascript
import libxmljs from 'libxmljs2';
import { readFileSync } from 'fs';

// Load XSD schema at application startup
const xsdContent = readFileSync('schemas/note.xsd', 'utf-8');
const xsdDoc = libxmljs.parseXml(xsdContent);

/**
 * Validates an XML string against the note schema
 * @param {string} xmlString - The XML content to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateNoteXML(xmlString) {
  try {
    const xmlDoc = libxmljs.parseXml(xmlString);
    const isValid = xmlDoc.validate(xsdDoc);
    
    if (isValid) {
      return { isValid: true, errors: [] };
    }
    
    return {
      isValid: false,
      errors: xmlDoc.validationErrors.map(err => ({
        message: err.message,
        line: err.line,
        column: err.column
      }))
    };
  } catch (parseError) {
    return {
      isValid: false,
      errors: [{ message: parseError.message, line: 0 }]
    };
  }
}
```

### Error Response Format

When XML validation fails, the API returns detailed error information to help users correct their XML:

```json
{
  "success": false,
  "message": "XML failed XSD validation",
  "errors": [
    {
      "message": "Element 'title': Missing child element(s).",
      "line": 3,
      "column": 0
    },
    {
      "message": "Element 'unknown': This element is not expected.",
      "line": 5,
      "column": 0
    }
  ]
}
```

---

## Data Models

### User Model

The User model stores authentication and profile information:

```javascript
const UserSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false  // Never return password in queries
    },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});
```

### Notebook Model

The Notebook model provides organizational structure:

```javascript
const NotebookSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Notebook name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    icon: { 
        type: String, 
        default: 'notebook',
        enum: ['notebook', 'briefcase', 'lightbulb', 'star', 'heart', 'folder']
    },
    color: { 
        type: String, 
        default: '#6366f1',
        match: [/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color']
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true  // Index for faster user-based queries
    },
    createdAt: { type: Date, default: Date.now }
});
```

### Note Model

The Note model is the core entity storing user content:

```javascript
const NoteSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'Note title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: { 
        type: String,
        default: ''
    },
    notebook: { 
        type: Schema.Types.ObjectId, 
        ref: 'Notebook',
        index: true
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    isFavorite: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
NoteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
```

---

## Part III: Technologies

## Technology Selection Philosophy

When selecting technologies for Notty, we followed these principles:

- **Modern & Maintained**: Choose actively maintained technologies with strong community support
- **Developer Experience**: Prioritize tools that enhance productivity and debugging
- **Performance**: Select efficient solutions that scale well
- **Ecosystem**: Prefer technologies with rich ecosystems of plugins and extensions
- **Learning Curve**: Balance power with accessibility for team members

---

## Technical Architecture

The application follows a classic **three-tier architecture**, separating concerns into distinct layers:

```text
┌─────────────┐       REST API       ┌─────────────┐      Mongoose      ┌─────────────┐
│  Frontend   │  ─────────────────▶  │   Backend   │ ─────────────────▶ │  MongoDB    │
│   React     │                      │  Express.js │                    │  Database   │
│   :3000     │                      │    :5000    │                    │   :27017    │
└─────────────┘                      └─────────────┘                    └─────────────┘
```

**Architecture benefits:**

- **Separation of Concerns**: Each layer has a specific responsibility
- **Independent Scaling**: Layers can be scaled independently based on load
- **Technology Flexibility**: Frontend or backend can be replaced without affecting other layers
- **Team Parallelism**: Frontend and backend teams can work independently

---

## Frontend Technologies

### React (v18.2.0)

**What it is:** React is a JavaScript library for building user interfaces, developed and maintained by Meta (Facebook). It uses a component-based architecture where UI elements are encapsulated as reusable components.

**Why we chose it:**

- **Virtual DOM**: React's virtual DOM efficiently updates only changed elements, providing excellent performance
- **Component Reusability**: Build once, use everywhere - components can be reused across the application
- **Large Ecosystem**: Thousands of libraries and tools available
- **Industry Standard**: Most popular frontend library with extensive job market support
- **React 18 Features**: Concurrent rendering, automatic batching, and Suspense for data fetching

### Vite (v5.0.8)

**What it is:** Vite is a next-generation frontend build tool that provides a faster and leaner development experience. It leverages native ES modules in the browser during development.

**Why we chose it over alternatives (Create React App, Webpack):**

- **Instant Server Start**: No bundling required during development
- **Lightning-Fast HMR**: Hot Module Replacement in milliseconds, not seconds
- **Optimized Build**: Uses Rollup for production builds with automatic code splitting
- **Native TypeScript Support**: No configuration needed
- **10-100x faster** than Webpack-based alternatives

### TailwindCSS (v3.4.0)

**What it is:** TailwindCSS is a utility-first CSS framework that provides low-level utility classes instead of pre-built components.

**Why we chose it:**

- **Rapid Prototyping**: Style directly in JSX without context switching to CSS files
- **Consistent Design**: Built-in design system with spacing, colors, and typography scales
- **No Dead Code**: PurgeCSS integration removes unused styles in production
- **Responsive Design**: Mobile-first breakpoint system (sm:, md:, lg:, xl:)
- **Dark Mode**: Native dark mode support with the `dark:` prefix

### Framer Motion (v10.16.16)

**What it is:** Framer Motion is a production-ready motion library for React that makes creating animations simple and declarative.

**Why we chose it:**

- **Declarative API**: Animations defined as props, not imperative code
- **Gestures**: Built-in support for drag, tap, hover, and pan gestures
- **Layout Animations**: Automatic animations when layout changes
- **Performance**: Hardware-accelerated animations using CSS transforms
- **Exit Animations**: AnimatePresence for unmount animations

### TipTap (v2.1.13)

**What it is:** TipTap is a headless, framework-agnostic rich text editor built on ProseMirror, the industry-standard editing framework.

**Why we chose it over alternatives (Quill, Draft.js, CKEditor):**

- **Headless Architecture**: Complete control over UI appearance
- **ProseMirror Foundation**: Battle-tested editing core used by major companies
- **Extensible**: Easy to add custom extensions and formatting options
- **React Integration**: Native React hooks and components
- **TypeScript Support**: Full type definitions included
- **Active Development**: Regular updates and responsive maintainers

### Zustand (v4.4.7)

**What it is:** Zustand is a small, fast, and scalable state management solution for React applications.

**Why we chose it over Redux or Context API:**

- **Minimal Boilerplate**: No actions, reducers, or dispatchers required
- **Small Bundle Size**: Only 1KB gzipped
- **No Providers**: No context provider wrapper needed
- **Selective Re-renders**: Re-renders only when subscribed state changes
- **DevTools Support**: Compatible with Redux DevTools for debugging

### React Router DOM (v6.21.1)

**What it is:** React Router is the standard routing library for React applications, enabling navigation between different views.

**Why we chose it:**

- **Client-Side Routing**: No page reloads when navigating
- **Nested Routes**: Support for complex route hierarchies
- **Protected Routes**: Easy implementation of authentication-required routes
- **URL Parameters**: Dynamic routing with path and search parameters

### Axios (v1.6.2)

**What it is:** Axios is a promise-based HTTP client for the browser and Node.js.

**Why we chose it over fetch API:**

- **Interceptors**: Modify requests/responses globally (e.g., add auth tokens)
- **Request Cancellation**: Cancel pending requests when components unmount
- **Automatic JSON Transformation**: No manual JSON.parse() needed
- **Error Handling**: HTTP errors are properly caught as errors
- **Request/Response Timeout**: Built-in timeout configuration

---

## Backend Technologies

### Node.js (v18+)

**What it is:** Node.js is a JavaScript runtime built on Chrome's V8 engine that allows running JavaScript on the server.

**Why we chose it:**

- **JavaScript Everywhere**: Same language for frontend and backend
- **Non-Blocking I/O**: Efficient handling of concurrent connections
- **NPM Ecosystem**: Largest package registry with over 2 million packages
- **LTS Support**: Long-term support with regular security updates
- **Performance**: V8 engine provides near-native execution speed

### Express.js (v4.18.2)

**What it is:** Express is a minimal and flexible Node.js web application framework that provides robust features for building web APIs.

**Why we chose it:**

- **Minimalist Core**: Only essential features, everything else is opt-in middleware
- **Middleware Pattern**: Composable request/response processing pipeline
- **Routing**: Powerful routing with support for parameters and middleware
- **Industry Standard**: Most popular Node.js framework with extensive documentation
- **Performance**: Lightweight with minimal overhead

### MongoDB (v7.0)

**What it is:** MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents.

**Why we chose it over SQL databases (PostgreSQL, MySQL):**

- **Flexible Schema**: No predefined schema needed, perfect for evolving data structures
- **Document Model**: Natural mapping to JavaScript objects
- **Horizontal Scaling**: Built-in sharding for distributing data
- **Rich Queries**: Support for complex queries, aggregations, and full-text search
- **JSON Native**: Direct storage of JSON documents without ORM overhead

### Mongoose (v8.0.3)

**What it is:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

**Why we chose it:**

- **Schema Definition**: Define document structure with validation rules
- **Type Casting**: Automatic conversion of data types
- **Query Building**: Chainable query API for complex database operations
- **Middleware Hooks**: Pre/post hooks for document lifecycle events
- **Population**: Reference other documents with automatic resolution

### JSON Web Tokens - JWT (v9.0.2)

**What it is:** JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object.

**Why we chose it over session-based authentication:**

- **Stateless**: No server-side session storage required
- **Scalable**: Works seamlessly across multiple server instances
- **Self-Contained**: Token contains all necessary user information
- **Cross-Domain**: Works with CORS and different client types
- **Mobile-Friendly**: No cookies required, perfect for mobile apps

### bcryptjs (v2.4.3)

**What it is:** bcryptjs is a library for hashing passwords using the bcrypt algorithm.

**Why we chose it:**

- **Adaptive Hashing**: Work factor can be increased as hardware improves
- **Built-in Salt**: Automatically generates and stores salt with each hash
- **Pure JavaScript**: No native dependencies, works everywhere
- **Timing Attack Resistant**: Constant-time comparison prevents timing attacks

### Multer (v1.4.5-lts.1)

**What it is:** Multer is Express middleware for handling multipart/form-data, primarily used for file uploads.

**Why we chose it:**

- **Easy Integration**: Seamlessly integrates with Express
- **Flexible Storage**: Disk or memory storage options
- **File Filtering**: Control which files are accepted
- **Size Limits**: Configure maximum file sizes

### xml2js & libxmljs2

**What they are:** xml2js converts between JavaScript objects and XML, while libxmljs2 provides XSD validation.

**Why we chose them:**

- **xml2js**: Simple API for XML-to-JSON and JSON-to-XML conversion
- **libxmljs2**: Native performance for XML parsing and XSD validation
- **Comprehensive Validation**: Full XSD 1.0 support

---

## Frontend Stack Summary

| Technology       | Role                              | Version   |
| ---------------- | --------------------------------- | --------- |
| React            | Component-based UI library        | 18.2.0    |
| Vite             | Fast build tool with instant HMR  | 5.0.8     |
| TailwindCSS      | Utility-first CSS framework       | 3.4.0     |
| Framer Motion    | Declarative animation library     | 10.16.16  |
| TipTap           | Headless rich text editor         | 2.1.13    |
| Zustand          | Lightweight state management      | 4.4.7     |
| React Router DOM | Client-side routing               | 6.21.1    |
| Axios            | Promise-based HTTP client         | 1.6.2     |
| Lucide React     | Modern icon library               | 0.303.0   |

## Backend Stack Summary

| Technology         | Role                               | Version     |
| ------------------ | ---------------------------------- | ----------- |
| Node.js            | Server-side JavaScript runtime     | 18+         |
| Express.js         | Minimalist web framework           | 4.18.2      |
| MongoDB            | Document-oriented database         | 7.0         |
| Mongoose           | MongoDB ODM with schema validation | 8.0.3       |
| JWT (jsonwebtoken) | Stateless authentication tokens    | 9.0.2       |
| bcryptjs           | Secure password hashing            | 2.4.3       |
| Multer             | Multipart file upload handling     | 1.4.5-lts.1 |
| xml2js             | XML/JSON conversion                | 0.6.2       |
| libxmljs2          | XSD validation engine              | latest      |
| express-validator  | Request data validation            | 7.0.1       |

---

## DevOps & Deployment Technologies

### Docker

**What it is:** Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers. Containers package an application with all its dependencies, ensuring consistent behavior across different environments.

**Why we chose it:**

- **Environment Consistency**: "Works on my machine" problems are eliminated—the same container runs identically in development, testing, and production
- **Isolation**: Each service runs in its own container with isolated dependencies, preventing conflicts
- **Portability**: Containers can run on any system with Docker installed, regardless of the underlying OS
- **Lightweight**: Containers share the host OS kernel, making them much faster and smaller than virtual machines
- **Version Control**: Dockerfiles version-control the infrastructure alongside the code
- **Scalability**: Easy to scale by running multiple container instances

**How we use it in Notty:**

- Separate Dockerfiles for frontend (React + Nginx) and backend (Node.js + Express)
- Multi-stage builds to minimize production image sizes
- Health checks to ensure container readiness before routing traffic

### Docker Compose

**What it is:** Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file to configure all application services, networks, and volumes in a single file.

**Why we chose it:**

- **Single Command Deployment**: Start the entire stack (frontend, backend, database) with `docker-compose up`
- **Service Orchestration**: Define service dependencies (e.g., backend waits for MongoDB)
- **Networking**: Services communicate via service names
- **Volume Management**: Persistent storage survives container restarts
- **Environment Configuration**: Centralized environment variable management
- **Development Parity**: Same config for development and production

**Our docker-compose.yml defines:**

- **Frontend service**: React app served through Nginx on port 3000
- **Backend service**: Express.js API on port 5000 with health checks
- **MongoDB service**: Database with authentication and persistent volumes
- **Shared network**: Internal network for secure inter-service communication

### Coolify

**What it is:** Coolify is an open-source, self-hostable Platform-as-a-Service (PaaS) alternative to Heroku, Vercel, or Netlify. It provides a user-friendly interface for deploying applications on your own servers.

**Why we chose it:**

- **Self-Hosted**: Complete control over your infrastructure and data—no vendor lock-in
- **Cost-Effective**: Deploy on affordable VPS providers instead of expensive PaaS solutions
- **Git Integration**: Automatic deployments when pushing to GitHub/GitLab repositories
- **SSL Certificates**: Automatic Let's Encrypt SSL certificate provisioning and renewal
- **Docker Native**: Seamlessly deploys Docker and Docker Compose applications
- **Database Management**: Built-in support for deploying and managing databases (MongoDB, PostgreSQL, etc.)
- **Environment Variables**: Secure management of secrets and configuration per deployment
- **Monitoring**: Real-time logs, resource usage monitoring, and deployment history

**How we use Coolify for Notty:**

- Connected to our GitHub repository for automatic deployments on push
- Configured environment variables for `MONGODB_URI`, `JWT_SECRET`, etc.
- Automatic SSL with custom domain (`notty.mehdiben.com`)
- Deployed MongoDB as a managed database resource
- Zero-downtime deployments with health check validation

---

## Project Structure

```text
notty_react/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/          # Axios configuration and API calls
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Route-level page components
│   │   ├── store/        # Zustand state stores
│   │   ├── hooks/        # Custom React hooks
│   ├── package.json
├── server/                # Express Backend
│   ├── config/           # Database and app configuration
│   ├── middleware/       # Express middleware (auth, validation)
│   ├── models/           # Mongoose schema definitions
│   ├── routes/           # API route handlers
│   ├── schemas/          # XSD schema files
│   ├── uploads/          # User uploaded files
│   ├── index.js          # Application entry point
├── docker-compose.yml    # Container orchestration
```

---

## Part IV: Application

## REST API

The API follows RESTful conventions with consistent URL patterns and HTTP methods.

### Authentication Endpoints

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | /api/auth/register | Create new user account              |
| POST   | /api/auth/login    | Authenticate and receive JWT         |
| GET    | /api/auth/me       | Get current user profile (protected) |
| PUT    | /api/auth/profile  | Update user profile (protected)      |

### Notebook Endpoints

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| GET    | /api/notebooks     | List all user's notebooks                |
| GET    | /api/notebooks/:id | Get notebook details with note count     |
| POST   | /api/notebooks     | Create new notebook                      |
| PUT    | /api/notebooks/:id | Update notebook properties               |
| DELETE | /api/notebooks/:id | Delete notebook and optionally its notes |

### Note Endpoints

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| GET    | /api/notes             | List notes (supports filtering)   |
| GET    | /api/notes/:id         | Get single note with full content |
| POST   | /api/notes             | Create new note                   |
| PUT    | /api/notes/:id         | Update note content               |
| DELETE | /api/notes/:id         | Delete note permanently           |

### Upload Endpoint

| Method | Endpoint    | Description                     |
| ------ | ----------- | ------------------------------- |
| POST   | /api/upload | Upload image file (returns URL) |

---

## Keyboard Shortcuts

| Shortcut             | Action                   |
| -------------------- | ------------------------ |
| Cmd/Ctrl + K         | Open global search modal |
| Cmd/Ctrl + S         | Save current note        |
| Cmd/Ctrl + B         | Toggle bold formatting   |
| Cmd/Ctrl + I         | Toggle italic formatting |
| Cmd/Ctrl + U         | Toggle underline         |
| Cmd/Ctrl + Shift + X | Toggle strikethrough     |
| Escape               | Close modals and dialogs |

---

## Deployment

### Deployment Options

1. **Local Development**: Run with npm for rapid development
2. **Docker Compose**: Containerized deployment with all services
3. **Coolify**: Self-hosted PaaS for production deployment

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build: 
      context: ./client
      args:
        - VITE_API_URL=http://localhost:5000
    ports: ["3000:80"]
    depends_on:
      backend: { condition: service_healthy }

  backend:
    build: ./server
    ports: ["5000:5000"]
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://notty:password@mongodb:27017/notty
      - JWT_SECRET=${JWT_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:7.0
    ports: ["27017:27017"]
    environment:
      - MONGO_INITDB_ROOT_USERNAME=notty
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes: 
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Environment Variables

| Variable     | Description                 | Example                 |
| ------------ | --------------------------- | ----------------------- |
| PORT         | Backend server port         | 5000                    |
| MONGODB_URI  | MongoDB connection string   | mongodb://...           |
| JWT_SECRET   | Secret for signing tokens   | (random 64 chars)       |
| JWT_EXPIRE   | Token expiration duration   | 7d                      |
| VITE_API_URL | API URL for frontend        | `http://localhost:5000` |

### Coolify Deployment Guide

Coolify provides a complete self-hosted Platform-as-a-Service solution for deploying Notty. This section details the installation, architecture, and deployment process.

#### VPS Prerequisites

Before installing Coolify, ensure your VPS meets these requirements:

- **Operating System**: Ubuntu 22.04 LTS (recommended), Debian 11+, or CentOS 8+
- **Minimum Resources**: 2 CPU cores, 2GB RAM, 30GB storage
- **Root Access**: SSH access with root or sudo privileges
- **Open Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 8000 (Coolify UI)
- **Domain**: A domain name pointing to your VPS IP (optional but recommended)

#### Coolify Installation

Install Coolify on your VPS with a single command:

```bash
# SSH into your VPS
ssh root@your-server-ip

# Run the official Coolify installer
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# The installer will:
# - Install Docker and Docker Compose
# - Set up Coolify containers
# - Configure the reverse proxy (Traefik)
# - Start the Coolify dashboard on port 8000
```

After installation completes:

1. Access Coolify at `http://your-server-ip:8000`
2. Create your admin account on first visit
3. Configure your server settings and add SSH keys if needed

#### Deployment Architecture

```text
┌─────────────────┐       API Calls       ┌─────────────────┐      Mongoose      ┌─────────────────┐
│    Frontend     │ ────────────────────▶ │     Backend     │ ─────────────────▶ │    MongoDB      │
│  (Nginx :80)    │                       │ (Node.js :5000) │                    │    (:27017)     │
└─────────────────┘                       └─────────────────┘                    └─────────────────┘
   notty.domain.com                         api.domain.com
```

#### Step-by-Step Deployment

1. **Deploy MongoDB Database**
   - Create a new Database resource in Coolify (MongoDB 7.0)
   - Enable `Connect to Predefined Network`
   - Note the connection string: `mongodb://user:pass@mongodb:27017/notty`

2. **Deploy Backend Service**
   - Connect Git repository (Branch: `main`)
   - Build Pack: Dockerfile, Location: `server/Dockerfile`
   - Set **Ports Exposes** to `5000`
   - Configure domain: `https://api.yourdomain.com`

3. **Deploy Frontend Service**
   - Connect Git repository (Branch: `main`)
   - Build Pack: Dockerfile, Location: `client/Dockerfile`
   - Set **Ports Exposes** to `80` (Nginx)
   - Configure domain: `https://yourdomain.com`

#### Custom Domain Configuration (Namecheap)

To connect a custom domain, configure DNS A records in Namecheap:

| Type     | Host    | Value     | Purpose                  |
| -------- | ------- | --------- | ------------------------ |
| A Record | @       | Server IP | Frontend (yourdomain.com)|
| A Record | www     | Server IP | WWW redirect             |
| A Record | api     | Server IP | Backend API              |
| A Record | coolify | Server IP | Coolify Dashboard        |

**Domain Propagation**: DNS changes may take up to 48 hours to propagate globally. Use [whatsmydns.net](https://www.whatsmydns.net/) to verify propagation status.

#### Common Pitfalls & Solutions

| Issue | Solution |
| --- | --- |
| Bad Gateway | Set correct Ports Exposes: Frontend = 80, Backend = 5000 |
| Frontend can't reach API | Set `VITE_API_URL` without `/api` suffix, then **Rebuild** |
| Login "Server Error" | Add `JWT_EXPIRE=7d` environment variable to backend |
| Changes not taking effect | Use **Rebuild** not Redeploy (Coolify caches images) |

### Backup & Disaster Recovery

Data backup is critical for any production deployment. Coolify provides multiple backup strategies for MongoDB databases.

#### Coolify Database Backups

Coolify offers built-in backup functionality for database resources:

1. **Navigate to MongoDB Resource** → **Backups** tab
2. **Enable Scheduled Backups**:
   - Configure backup frequency (daily, weekly, or custom cron)
   - Set retention policy (number of backups to keep)
   - Choose backup destination (local, S3, or external storage)
3. **Manual Backups**: Click "Create Backup Now" for immediate backup
4. **Restore**: Select any backup point and click "Restore" to recover data

#### Backup Storage Options

| Storage Type  | Description                                          |
| ------------- | ---------------------------------------------------- |
| Local Storage | Backups stored on the Coolify server (default)       |
| S3 Compatible | AWS S3, DigitalOcean Spaces, MinIO, Backblaze B2     |
| SFTP/SSH      | Remote server via secure file transfer               |

#### Volume Persistence

Ensure persistent storage is configured for both MongoDB data and user uploads:

| Service | Volume Name   | Container Path |
| ------- | ------------- | -------------- |
| MongoDB | mongodb_data  | /data/db       |
| Backend | notty-uploads | /app/uploads   |

These volumes survive container restarts and redeployments, ensuring data persistence across updates.

---

## Screenshots

### Landing Page

![Notty Landing Page](assets/home.png)

From the landing page, you can discover all the features Notty offers. Click **Get Started** or **Login** to access the application. The page highlights key capabilities: a powerful rich text editor, organized notebooks with custom icons and colors, and a beautiful dark mode interface. New users can click **Sign Up** to create an account, while existing users can proceed directly to login.

### Login Page

![Login Page](assets/login.png)

To access your notes, enter your email and password, then click **Login**. If you don't have an account, click **Sign Up** to register with your name, email, and a password (minimum 6 characters). After successful authentication, you'll be redirected to your dashboard where all your notebooks and notes are stored securely.

### Dashboard

![Dashboard](assets/dashboard.png)

The dashboard is your workspace for managing notes. Use the **left sidebar** to create and switch between notebooks—click the **+** button to add a new notebook with a custom icon and color. Select a notebook to view its notes in the main area. To quickly find any note, press **Cmd/Ctrl+K** to open the global search. You can **star** notes to mark them as favorites, **pin** important notes to the top, or **delete** notes you no longer need via the context menu.

### Note Editor

![Note Editor](assets/note.png)

Click on any note to open the editor. Use the **toolbar** to format your text: apply **H1/H2/H3** headings, make text **bold** (Ctrl+B), *italic* (Ctrl+I), or underlined (Ctrl+U). Create bullet lists, numbered lists, or task lists with checkboxes. Insert code blocks with syntax highlighting for technical notes, and add images by clicking the image icon or dragging files directly into the editor. Your notes **auto-save** as you type, so you never lose your work.

---

## Installation

### Prerequisites

- Node.js 18 or higher
- MongoDB 6.0+ (local or MongoDB Atlas)
- npm or yarn package manager
- Docker and Docker Compose (optional)
- Git for cloning the repository

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Mehdirben/notty_react
cd notty_react

# Install all dependencies (frontend + backend)
npm run install:all

# Configure environment variables
cat > server/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notty
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRE=7d
EOF

# Start MongoDB (if local)
mongod --dbpath /path/to/data

# Run the application in development mode
npm run dev

# Application URLs:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## Security Considerations

> [!WARNING]
> **Production Security Checklist**
>
> - Use strong, unique values for JWT_SECRET (minimum 64 random characters)
> - Always deploy behind HTTPS with valid SSL certificates
> - Configure CORS whitelist to only allow your domain
> - Regularly update all dependencies with `npm audit fix`
> - Enable MongoDB authentication and use strong passwords
> - Implement rate limiting to prevent brute force attacks
> - Set secure and httpOnly flags on cookies if used
> - Enable MongoDB backup automation

### Implemented Security Measures

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Authentication**: Signed tokens with configurable expiration
- **Input Validation**: express-validator on all endpoints
- **XSS Protection**: Content sanitization in the editor
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: HTTP security headers (optional)

---

## Conclusion

Notty represents a modern and comprehensive solution for note-taking, combining an elegant user interface with a robust backend architecture.

### Key Achievements

- **Modern Technology Stack**: React 18, Vite, TailwindCSS for optimal developer and user experience
- **Data Portability**: Full XML/XSD implementation for standardized data exchange
- **Professional Editor**: TipTap provides a feature-rich, extensible editing experience
- **Flexible Deployment**: Docker support enables consistent deployment across environments
- **Security First**: JWT authentication, password hashing, and input validation
- **Scalable Architecture**: Stateless API design supports horizontal scaling

### Future Enhancements

- Real-time collaboration using WebSockets
- Mobile applications (React Native)
- Plugin system for custom extensions
- Full-text search with Elasticsearch
- End-to-end encryption option

---

**Repository:** [https://github.com/Mehdirben/notty_react](https://github.com/Mehdirben/notty_react)

---

## Part V: Annexes

This section contains key source code extracts from the Notty application.

## Note Model with XML Support

```javascript
// server/models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a note title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: { type: String, default: '' },
  notebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{ type: String, trim: true }],
  isPinned: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Note', noteSchema);
```

---

## XSD Schema

```xml
<!-- server/schemas/note.xsd -->
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           elementFormDefault="qualified">
  
  <xs:element name="note" type="NoteType"/>
  
  <xs:complexType name="NoteType">
    <xs:all>
      <xs:element name="title" type="xs:string" minOccurs="1"/>
      <xs:element name="content" type="xs:string" minOccurs="1"/>
      <xs:element name="createdAt" type="xs:string" minOccurs="0"/>
      <xs:element name="updatedAt" type="xs:string" minOccurs="0"/>
      <xs:element name="tags" type="TagsType" minOccurs="0"/>
    </xs:all>
  </xs:complexType>
  
  <xs:complexType name="TagsType">
    <xs:sequence>
      <xs:element name="tag" type="xs:string" 
                  minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
  
</xs:schema>
```

---

## JWT Authentication Middleware

```javascript
// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired, please log in again',
          expired: true
        });
      }
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
};
```

---

## Zustand Authentication Store

```javascript
// client/src/store/authStore.js
import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('notty_user')) || null,
  token: localStorage.getItem('notty_token') || null,
  isAuthenticated: !!localStorage.getItem('notty_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('notty_token', data.token);
      localStorage.setItem('notty_user', JSON.stringify(data));
      set({ user: data, token: data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('notty_token');
    localStorage.removeItem('notty_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
```
