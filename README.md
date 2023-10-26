This repository contains a set of TypeScript classes and utility functions for handling file validation and manipulation in an Angular application. The main classes provided in this library are `$error`, `$errors`, `$rule`, `BaseDto`, and `FileData`. Additionally, the library defines various file type enums and utility functions to work with file data.

## Table of Contents

- [Usage](#usage)
- [Classes](#classes)
- [Enums](#enums)
- [Utility Functions](#utility-functions)
- [License](#license)

## Usage

Import the necessary classes and enums into your Angular component or service as needed. You can then utilize them for file validation, processing, and manipulation.

Here's an example of how to use the `fileUtil` class to perform file validation and read file data:

```typescript
import { fileUtil, $rule, FileData, FileType, FileCats } from '@angular-file-util/library';

// Define your validation rule
const validationRule: $rule = {
  size: 1024 * 1024,  // 1 MB
  types: [FileType.JPEGimages, FileType.PortableNetworkGraphics], // Allowed file types
  required: true,
  deep: true,
  maxlength: 200,
};

// Get the FileList from an HTML input element
const files: FileList = // ...

// Perform file validation
const errors = fileUtil.validate(files, validationRule);

if (errors) {
  // Handle validation errors
  console.log(errors);
} else {
  // All files are valid, proceed with file processing
  fileUtil.from(files, validationRule).then((fileDataArray: FileData[]) => {
    // Process the valid file data
    console.log(fileDataArray);
  });
}
```

For detailed documentation on each class and function, please refer to the comments in the code.

## Classes

### $error
An interface representing a validation error. It includes properties like `message`, `index`, and `value`.

### $errors
An array of `$error` objects or `null` values, used for reporting multiple validation errors.

### $rule
A class representing a validation rule for files. It includes properties like `size`, `types`, `required`, `deep`, `chunk`, and `maxlength`.

### BaseDto
A base class for DTOs (Data Transfer Objects) with common properties like `id` and `version`.

### FileData
A class representing file data, extending the `BaseDto` class. It includes properties like `name`, `size`, `type`, and methods for extracting file extensions and data URLs.

### fileUtil
A utility class with static methods for file handling, including validation, reading, and processing.

## Enums

### FileType
An enum representing common file types with associated extensions.

### FileCat
An enum representing file categories like 'image', 'document', 'excel', and 'archive'.

## Utility Functions

- `FilesLib`: An object mapping file types to their respective file information, including hex signatures and MIME types.
- `FileCats`: An object mapping file categories to arrays of file types.
