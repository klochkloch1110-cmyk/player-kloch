// Type definitions for jsmediatags
declare module 'jsmediatags' {
  export interface TagType {
    type: string;
    tags: {
      title?: string;
      artist?: string;
      album?: string;
      year?: string;
      genre?: string;
      track?: string | number;
      picture?: {
        data: Uint8Array | number[];
        format: string;
        type?: string;
        description?: string;
      };
      [key: string]: any;
    };
  }

  export interface ReadConfig {
    onSuccess: (tag: TagType) => void;
    onError: (error: { type: string; info: string }) => void;
  }

  export function read(file: string | File | Blob, config: ReadConfig): void;

  export default {
    read,
  };
}
