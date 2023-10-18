import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: '/index.html',
                palvelut: '/Palvelut/palvelut.html',
                colors: '/Colors/colors.html',
                gallery: '/Gallery/gallery.html',
                contact: '/Contact/contact.html',
                // ...
                // List all files you want in your build
            }
        }
    },
    base: '',
});