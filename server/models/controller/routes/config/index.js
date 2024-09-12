import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(
    cors({
        credentials: true,
        origin: "",
        methods: "GET,POST,OPTIONS,PUT,PATCH,POST,DELETE",
    })
);

app.listen(3000, () => {
    console.log("la app funciona");
})