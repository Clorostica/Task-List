interface ImportMetaEnv {
  readonly VITE_API: string;
  // Añade todas tus variables de entorno aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
