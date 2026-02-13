const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// ================== VARIABLES ==================
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
    console.error("❌ ERROR: BOT_TOKEN no definido");
    process.exit(1);
}

const URL = process.env.RENDER_EXTERNAL_URL;
if (!URL) {
    console.error("❌ ERROR: RENDER_EXTERNAL_URL no detectado");
    process.exit(1);
}

// ================== APP EXPRESS ==================
const app = express();
app.use(express.json());

// ================== BOT WEBHOOK ==================
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${URL}/bot${TOKEN}`);

// ================== FUNCIÓN BIENVENIDA ==================
function getWelcomeMessage() {
    return {
        media: 'https://i.postimg.cc/Z54nVQn9/img2.jpg',
        caption: `🙈 *NATHALY JESSIC😈*

🔥 *SUSCRÍBETE* 🔥

Hola, me alegro de que finalmente me hayas encontrado 🔥  
¿Quieres descubrir el contenido de mi canal VIP? 😏

💙 *PROPINA: 21 USD*  
Acceso a fotos y videos exclusivos 🔥

🔥 *DURA 1 MES*  
Tipo OnlyFans 😈

👇 Elige un método de pago`,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "💳 Método de pago", callback_data: "metodo_pago" }]
            ]
        }
    };
}

// ================== WEBHOOK ==================
app.post(`/bot${TOKEN}`, async (req, res) => {
    res.sendStatus(200);
    bot.processUpdate(req.body);
});

// ================== ENDPOINT ==================
app.get('/', (req, res) => {
    res.send('Bot activo 🚀');
});

// ================== PUERTO ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 Bot escuchando en puerto ${PORT}`);
});

// ================== /START ==================
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const welcome = getWelcomeMessage();

    await bot.sendPhoto(chatId, welcome.media, {
        caption: welcome.caption,
        parse_mode: welcome.parse_mode,
        reply_markup: welcome.reply_markup
    });
});

// ================== BOTONES ==================
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    try {

        // ===== MENÚ MÉTODOS =====
        if (query.data === 'metodo_pago') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/28fSStQ3/img5.jpg',
                    caption: `*TODOS MIS MÉTODOS DE PAGO* 🥰

🇧🇴 Bolivia  
🌍 Extranjero`,
                    parse_mode: "Markdown"
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🇧🇴 QR Bolivia', callback_data: 'qr_bolivia' }],
                            [{ text: '💳 PayPal', callback_data: 'paypal' }],
                            [{ text: '💳 Pago con tarjeta', callback_data: 'tarjeta' }],
                            [{ text: '⬅️ Volver', callback_data: 'volver' }]
                        ]
                    }
                }
            );
        }

        // ===== QR BOLIVIA =====
        else if (query.data === 'qr_bolivia') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/yYwWcd4w/Whats-App-Image-2026-02-10-at-12-02-12.jpg',
                    caption: `🇧🇴 *PAGAR 150 BS*

Envía la captura del pago 👇`,
                    parse_mode: "Markdown"
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '✅ Enviar captura', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        }

        // ===== PAYPAL =====
        else if (query.data === 'paypal') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/5y4rgHF9/depositphotos-220680152-stock-illustration-paypal-logo-printed-white-paper.jpg',
                    caption: `💎 *SUSCRIPCIÓN VIP*

💰 *21 USD*  
📧 alejandrohinojosasoria237@gmail.com

Envía la captura después de pagar.`,
                    parse_mode: "Markdown"
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }],
                            [{ text: '📤 Enviar captura', url: 'https://t.me/agentedeinformacion' }]
                        ]
                    }
                }
            );
        }

        // ===== TARJETA (ARREGLADO) =====
        else if (query.data === 'tarjeta') {
            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: 'https://i.postimg.cc/Z5Yw0YwM/credit-card.jpg',
                    caption: `💳 *PAGO CON TARJETA*

💰 *Monto: 22 USD*

1️⃣ Presiona "Ir a pagar"  
2️⃣ Ingresa tu correo  
3️⃣ Coloca tu tarjeta  
4️⃣ Envía la captura`,
                    parse_mode: "Markdown"
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Ir a pagar', url: 'https://app.takenos.com/pay/11c877cb-721b-483e-a339-05b358ea19f8' }],
                            [{ text: '📤 Enviar captura', url: 'https://t.me/agentedeinformacion' }],
                            [{ text: '⬅️ Volver', callback_data: 'metodo_pago' }]
                        ]
                    }
                }
            );
        }

        // ===== VOLVER =====
        else if (query.data === 'volver') {
            const welcome = getWelcomeMessage();

            await bot.editMessageMedia(
                {
                    type: 'photo',
                    media: welcome.media,
                    caption: welcome.caption,
                    parse_mode: "Markdown"
                },
                {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: welcome.reply_markup
                }
            );
        }

        await bot.answerCallbackQuery(query.id);

    } catch (e) {
        console.log('❌ Error:', e.message);
    }
});
