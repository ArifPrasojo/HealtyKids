
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // tambahkan environment variables lain di sini jika ada
  // readonly VITE_APP_NAME: string;
  // readonly VITE_API_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";