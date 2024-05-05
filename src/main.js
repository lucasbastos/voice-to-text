import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

createApp(App)
.use(ToastPlugin)
.use(createI18n({
    legacy: false,
    locale: 'en', // set current locale
    fallbackLocale: 'en',
    messages: {
      en: {
        message: {
          hello: 'hello world'
        }
      },
      ja: {
        message: {
          hello: 'こんにちは、世界'
        }
      }
    }
}))
.mount('#app')

