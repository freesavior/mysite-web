import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import fetch from 'node-fetch'; 


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.enable('trust proxy');


app.use((req, res, next) => {
  const allowedHost = process.env.DOMAIN_NAME; 
  
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  
  if (req.headers.host === allowedHost) {
    return res.redirect('https://' + allowedHost + req.url);
  }

  res.status(400).send('Bad Request');
});


  
  

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD // Le mot de passe d'application généré par Google
    }
});

let isAvailable = true;

// Route principale
app.get("/", (req, res) => {
    const year = new Date().getFullYear();
    const author = "Omar Baraze";
    const message = req.query.message || ''; // Message de succès ou d'erreur
    res.render('index.ejs', { year, author, lang: "fr", message, isAvailable });
});

app.get("/en", (req, res) => {
    const year = new Date().getFullYear();
    const author = "Omar Baraze";
    const message = req.query.message || ''; // Message de succès ou d'erreur
    res.render('index-en.ejs', { year, author, lang: "en", message, isAvailable });
});

// Route pour le formulaire de contact
app.post('/contact', async (req, res) => {
    const { name, email, message, 'g-recaptcha-response': recaptchaResponse, lang } = req.body;

    // Verify the reCAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
    const recaptchaVerification = await fetch(verifyUrl, { method: 'POST' }).then(res => res.json());

    
    const formData = {
        name: name || '',
        email: email || '',
        message: message || ''
    };

    if (!recaptchaVerification.success) {
        return res.render(lang === 'en' ? 'index-en' : 'index', {
            year: new Date().getFullYear(),
            author: "Omar Baraze",
            lang: lang,
            message: 'recaptcha-failure',
            anchor: '#contact',
            formData: formData,
            isAvailable
        });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New message from ${name}`,
            text: `You have received a message from ${name} (${email}):\n\n${message}`
        };

        await transporter.sendMail(mailOptions);

        // Redirect with success message
        res.redirect(`/${lang === 'en' ? 'en' : ''}?message=success#contact`);
    } catch (error) {
        console.error("Error sending email:", error);
        return res.render(lang === 'en' ? 'index-en' : 'index', {
            year: new Date().getFullYear(),
            author: "Omar Baraze",
            lang: lang,
            message: 'error',
            anchor: '#contact',
            formData: formData, 
            isAvailable
        });
    }
});


// Routes pour le téléchargement
app.get('/telecharger-cv-fr', function (req, res) {
    const file = `${__dirname}/upload-folder/CV-2+.pdf`;
    res.download(file); // Télécharger la version française du CV.
});

app.get('/telecharger-cv-en', function (req, res) {
    const file = `${__dirname}/upload-folder/CV-anglais.pdf`;
    res.download(file); // Télécharger la version anglaise du CV.
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
