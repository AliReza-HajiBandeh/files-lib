import {ValidationErrors} from "@angular/forms";

export interface $error extends ValidationErrors {
    message?: string;
    index?: number;
}

export type $errors = ($error | null)[]

export type $rule = {
    size: number;
    types: FileType[],
    required?: boolean;
    deep?: boolean;
    chunk?: number,
    maxlength?: number
}

export class BaseDto {
    id: number;
    version: number;
    constructor(options?: any) {
        this.id = options?.id ?? null;
        this.version = options?.version ?? null;
    }

    valueOf() {
        return this.id;
    }

    toString() {
        // @ts-ignore
        return this.name || ''; 
    }
}

export class FileData extends BaseDto {
    name: string;
    size: number;
    type: string;
    novalidate: boolean;
    arrayBuffer: ArrayBuffer;
    base64: string;
    file?: File;

    get extension(): string | null {
        const filename = this.name?.split('.');
        return filename?.length ? filename?.[filename.length - 1].toLowerCase() : null;
    }

    get dataURL(): string | null {
        return this.base64 && this.type ? `data:${this.type};base64,${this.base64}` : null;
    }

    constructor(options?: any) {
        super(options);
        this.novalidate = false;
        this.name = options?.name || options?.fileName || null;
        this.type = options?.type || null;
        this.size = options?.size || null;
        this.base64 = options?.base64 || null;
        this.arrayBuffer = options?.arrayBuffer || null;
        if (options instanceof File) {
            this.file = options;
        }
    }
}

export enum FileType {
    AdobePortableDocumentFormat = 'pdf',
    PortableNetworkGraphics = 'png',
    MicrosoftWordOpenXML = 'docx',
    JPEGimages = 'jpeg',
    MicrosoftWord = 'doc',
    ZIParchive = 'zip',
    MicrosoftExcel = 'xls',
    MicrosoftExcelOpenXML = 'xlsx',
    RARarchive = 'rar',
    Text = 'txt'
}

export type FileCat = 'image' | 'document' | 'excel' | 'archive';

export const FileCats: { [key in FileCat]: FileType[] } = {
    image: [FileType.JPEGimages, FileType.PortableNetworkGraphics],
    document: [FileType.Text, FileType.MicrosoftWord, FileType.AdobePortableDocumentFormat],
    excel: [FileType.MicrosoftExcel, FileType.MicrosoftExcelOpenXML],
    archive: [FileType.RARarchive, FileType.ZIParchive]
}

export type FileLib = {
    hex: string[],
    mime: string,
    extensions: string,
    offset: [number, number]
}

export const FilesLib: { [key in FileType]: FileLib } = {
    [FileType.PortableNetworkGraphics]: {
        hex: [
            '89 50 4E 47 0D 0A 1A 0A'
        ],
        mime: 'image/png',
        extensions: `.${FileType.PortableNetworkGraphics}`,
        offset: [0, 8]
    },
    [FileType.JPEGimages]: {
        hex: [
            'FF D8 FF EE',
            'FF D8 FF E0',
            'FF D8 FF E1',
            'FF D8 FF E2',
            'FF D8 FF E3',
            'FF D8 FF E8',
        ],
        mime: 'image/jpeg',
        extensions: `.${FileType.JPEGimages}, .jpg`,
        offset: [0, 4],
    },
    [FileType.AdobePortableDocumentFormat]: {
        hex: [
            '25 50 44 46 2D'
        ],
        mime: 'application/pdf',
        extensions: `.${FileType.AdobePortableDocumentFormat}`,
        offset: [0, 5]
    },
    [FileType.MicrosoftWordOpenXML]: {
        hex: [
            '50 4B 03 04',
            '50 4B 05 06',
            '50 4B 07 08',
            '50 4B 03 04 14 00 06 00',
        ],
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extensions: `.${FileType.MicrosoftWordOpenXML}`,
        offset: [0, 8]
    },
    [FileType.MicrosoftWord]: {
        hex: [
            'D0 CF 11 E0 A1 B1 1A E1',
            '0D 44 4F 43',
            'CF 11 E0 A1 B1 1A E1 00',
            'DB A5 2D 00',
            'EC A5 C1 00'
        ],
        mime: 'application/msword',
        extensions: `.${FileType.MicrosoftWord}`,
        offset: [0, 8]
    },
    [FileType.ZIParchive]: {
        hex: [
            '50 4B 03 04',
            '50 4B 05 06',
            '50 4B 07 08',
            '50 4B 4C 49 54 45',
            '50 4B 53 70 58',
            '57 69 6E 5A 69 70',
            '50 4B 03 04 14 00 01 00',
        ],
        mime: 'application/zip, application/x-zip-compressed',
        extensions: `.${FileType.ZIParchive}`,
        offset: [0, 8]
    },
    [FileType.MicrosoftExcel]: {
        hex: [
            'D0 CF 11 E0 A1 B1 1A E1',
            '09 08 10 00 00 06 05 00',
            'FD FF FF FF 10',
            'FD FF FF FF 1F',
            'FD FF FF FF 22',
            'FD FF FF FF 23',
            'FD FF FF FF 28',
            'FD FF FF FF 29',
        ],
        mime: 'application/vnd.ms-excel',
        extensions: `.${FileType.MicrosoftExcel}`,
        offset: [0, 8]
    },
    [FileType.MicrosoftExcelOpenXML]: {
        hex: [
            '50 4B 03 04',
            '50 4B 05 06',
            '50 4B 07 08',
            '50 4B 03 04 14 00 06 00'
        ],
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extensions: `.${FileType.MicrosoftExcelOpenXML}`,
        offset: [0, 8]
    },
    [FileType.RARarchive]: {
        hex: [
            '52 61 72 21 1A 07 00',
            '52 61 72 21 1A 07 01 00',
        ],
        mime: 'application/vnd.rar, application/octet-stream',
        extensions: `.${FileType.RARarchive}`,
        offset: [0, 8]
    },
    [FileType.Text]: {
        hex: [
            'EF BB BF',
            'FF FE',
            'FE FF',
            'FF FE 00 00',
            '00 00 FE FF',
            '0E FE FF',
        ],
        mime: 'text/plain',
        extensions: `.${FileType.Text}`,
        offset: [0, 4]
    }
}

export class fileUtil {
    static async from(files: FileList, options?: $rule): Promise<FileData[]> {
        return await Promise.all(Array.from(files).slice(0, options?.chunk || 1).map(file => this.read(file, options)));
    }

    static async read(file: File, options?: $rule): Promise<FileData> {
        return await new Promise<FileData>((resolve) => {
            const fileData = new FileData(file);
            const reader = new FileReader();
            reader.onload = ($event) => {
                const result = <string>$event.target?.result;
                if (result) {
                    const dataParts = result.split(',');
                    fileData.type = dataParts[0].replace('data:', '').replace(';base64', '');
                    fileData.base64 = dataParts[1];
                }
                resolve(fileData);
            }

            const extension = <string>fileData.extension;
            const extensions = options?.types.length ? options.types.map(type => FilesLib[type].extensions).join(',') : [''];
            if ((options?.size || 1024 * 1024) >= fileData.size && (options?.types.length === 0 || (extension && extensions.includes(`.${extension}`)))) {
                file.arrayBuffer().then((result) => {
                    fileData.arrayBuffer = result;
                    reader.readAsDataURL(file);
                });
            } else {
                resolve(fileData);
            }
        })
    }

    static validate(files: FileData[] | FileList, options: $rule = {
        types: [...FileCats.image, FileType.AdobePortableDocumentFormat] as FileType[],
        size: 1024 ** 2,
        required: true,
        deep: true,
        maxlength: 200
    }): $errors | null {
        let errors: $errors = [null];
        const typeCheck = Boolean(options?.types.length);
        if (!options?.size) {
            return errors = [{message: 'Please set [size]!'}];
        }

        if (files?.length) {
            const extensions = options.types.map(type => FilesLib[type].extensions).join(',');
            if (files instanceof FileList || !(files[0] instanceof FileData)) {
                files = Array.from(<any>files).map(file => new FileData(file));
            }
            for (let i = 0; i < files?.length; ++i) {
                errors[i] = null;
                if (files[i]?.novalidate) {
                    continue;
                }

                if (!files[i]?.name && Boolean(options?.required)) {
                    errors[i] = {message: 'required', required: true, index: i};
                    continue;
                }

                if (files[i]?.name) {
                    const extension = <string>files[i].extension;
                    if (typeCheck && !extensions.includes(`.${extension}`)) {
                        errors[i] = {
                            message: `The file should be on of ${options.types.join(' or ')}`,
                            value: extension,
                            index: i,
                        };
                        continue;
                    }
                    if (files[i]?.size > options?.size) {
                        errors[i] = {
                            message: `The size should be less than ${this.evalSize(options.size)}!`,
                            maxSize: options.size,
                            value: files[i].size,
                            index: i
                        };
                        continue;
                    }
                    if (options?.maxlength && files[i].name?.length > options?.maxlength) {
                        errors[i] = {
                            message: `The filename should be less than ${options.maxlength} characters!`,
                            value: files[i].name?.length,
                            index: i
                        };
                        continue;
                    }
                    const index = extension && options?.deep ? Object.values(FilesLib).findIndex((lib => lib.extensions.includes(`.${extension}`))) : -1;
                    if (typeCheck && index >= 0) {
                        if (files[i].arrayBuffer?.byteLength) {
                            let hex = '';
                            const type = <FileType>Object.keys(FilesLib)[index];
                            new Uint8Array(files[i].arrayBuffer.slice(...FilesLib[type].offset) as ArrayBuffer).forEach(byte => {
                                const code = byte.toString(16).toUpperCase();
                                hex += code?.length === 1 ? '0' + code : code;
                            });
                            if (!FilesLib[type].hex.find(signature => hex.indexOf(signature.replace(/\s/g, '')) > -1)) {
                                errors[i] = {
                                    message: `The file content is not ${extension}!`,
                                    value: extension,
                                    index: i
                                };
                            }
                        }
                    }
                }
            }
        } else if (Boolean(options?.required)) {
            return errors = [{message: 'required', required: true, index: 0}];
        }
        return errors.every(error => error === null) ? null : errors;
    }

    static evalSize(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
    }
}
