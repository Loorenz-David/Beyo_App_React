import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

declare const require: any;

// https://vite.dev/config/
export default defineConfig(({command}) => {
  const config: any = {
    plugins: [react(),svgr()],
    server:{
      host:true,
      proxy:{
        '/api':{
          target:'https://127.0.0.1:5001',
          changeOrigin:true,
          secure:false}
      }

    }
  }

  if(command === 'serve'){
    const fs = require('fs')
    config.server.https = {
      key:fs.readFileSync('./localhost+1-key.pem'),
      cert:fs.readFileSync('./localhost+1.pem')
    }
  }

  return config
})
