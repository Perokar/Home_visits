const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/UserModel');
const Client = require('./models/ClientModel');
const Joi = require('joi');
const dotenv = require('dotenv');
const cors = require('cors'); // НЕ забить удалить

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // НЕ забить удалить
const database = process.env.DATABASE;

mongoose.connect(database)
    .then(() => console.log(`База даних підключена успішно`))
    .catch((err) => console.log(`Помилка підключення до бази даних:`, err));

const registerSchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().min(3).max(50).required(),
    region: Joi.string().min(2).max(50).required(),
    cpmsd: Joi.string().min(2).max(50).required(),
    ambulatoriya: Joi.string().min(2).max(50).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('медсестра', 'директор', 'перевіряючий', 'адміністратор')
});

const loginSchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required()
});

const clientSchema = Joi.object({
    Type: Joi.string().required(),
    fullName: Joi.string(),
    BirthDate: Joi.date().required(),
    Locality: Joi.string().required(),
    Region: Joi.string().required(),
    VPO: Joi.boolean(),
    declaration_parents: Joi.string(),
    declaration: Joi.string()
});

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', validateRequest(registerSchema), async (req, res) => {
    try {
        const { login, fullName, region, cpmsd, ambulatoriya, password, role } = req.body;

        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            login,
            fullName,
            region,
            cpmsd,
            ambulatoriya,
            password: hashedPassword,
            role: role || 'медсестра'
        });

        await newUser.save();
        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера: ' + error });
    }
});

app.post('/login', validateRequest(loginSchema), async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }
        console.log(user);
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }

        const token = await jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
       console.log(token);
       // res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Успішний вхід', role: user.role, token: token });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера'+ error});
    }
});

app.post('/clients', authenticateToken, validateRequest(clientSchema), async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'медсестра') {
            return res.status(403).json({ message: 'Доступ заборонено' });
        }

        const newClient = new Client({
            ...req.body,
            Id_nurse: user._id
        });

        await newClient.save();
        res.status(201).json({ message: 'Клієнт успішно створений' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера: ' + error });
    }
});
app.post('/administrator', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'адміністратор') {
            return res.status(403).json({ message: 'Доступ заборонено' });
        }

        const { login, fullName, region, cpmsd, ambulatoriya, password, role } = req.body;

        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            login,
            fullName,
            region,
            cpmsd,
            ambulatoriya,
            password: hashedPassword,
            role: role || 'медсестра'
        });

        await newUser.save();

        const users = await User.find();
        res.status(201).json({ message: 'Користувач успішно створений', users });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера: ' + error });
    }
});

// Отримання списку користувачів (тільки для адміністратора)
app.get('/users', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'адміністратор') {
            return res.status(403).json({ message: 'Доступ заборонено' });
        }

        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера: ' + error });
    }
});
app.get('/logout', (req, res) => {
   // res.clearCookie('token');
    res.json({ message: 'Успішний вихід' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));