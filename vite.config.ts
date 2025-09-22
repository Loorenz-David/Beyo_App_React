import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import {VitePWA} from 'vite-plugin-pwa'

declare const require: any;

// https://vite.dev/config/
export default defineConfig(async ({command}) => {
  const config: any = {
    build:{
      sourcemap:false,
      minify:'esbuild'
    },
    plugins: [react(),svgr(),
      VitePWA({
        injectRegister:'auto',
        manifest:{
                        "short_name": "Beyo",
                        "name": "Beyo Purchase App",
                        "icons": [
                          {
                            "src": "/icon-192x192.png",
                            "sizes": "192x192",
                            "type": "image/png"
                          },
                          {
                            "src": "/icon-512x512.png",
                            "sizes": "512x512",
                            "type": "image/png"
                          }
                        ],
                        "start_url": "/",
                        "display": "standalone",
                        "theme_color": "#272727",
                        "background_color": "#272727"
                      }
      })
    ],
    
   
  }

  if(command === "serve"){
    config.preview = {
      allowedHosts:["2957f9d88566.ngrok-free.app"]
    }
    config.server = {
      host:true,
      proxy:{
        '/api':{
          target:'https://127.0.0.1:5001',
          changeOrigin:true,
          secure:false}
      }

    }
      //   const fs = await import('fs')
      //   config.server.https = {
      //     key:fs.readFileSync('./localhost+1-key.pem'),
      //     cert:fs.readFileSync('./localhost+1.pem')
      //   }
  }

  

  return config
})
