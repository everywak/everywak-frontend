interface ImportMetaEnv {
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_BACKEND_TWITCH_CLIENT_ID: string;
  readonly VITE_TWITCH_CLIENT_ID: string;
  readonly VITE_TWITCH_CHANNEL_NAME: string;
  readonly VITE_DOMAIN: string;
  readonly VITE_CLARITY_ID: string;
  readonly GENERATE_SOURCEMAP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
