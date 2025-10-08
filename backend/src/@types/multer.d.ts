declare module "multer" {
  export class MulterError extends Error {
    code: string;
  }
}
