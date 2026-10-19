const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const { body, validationResult} = require("express-validator");

router.get("/", (req, res) => {
    res.render("contato", {erros: {}, dados: {}});
});

router.post("/", [
    body("nome")
        .trim()
        .notEmpty()
        .withMessage("O nome é obrigatório."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("O e-mail é obrigatório.")
        .isEmail()
        .withMessage("Digite um e-mail válido."),
    body("telefone")
        .trim()
        .notEmpty()
        .withMessage("O telefone é obrigatório."),
    body("assunto")
        .trim()
        .notEmpty()
        .withMessage("O assunto é obrigatório."),
    body("mensagem")
        .trim()
        .notEmpty()
        .withMessage("A mensagem é obrigatória.")

],
async (req,res) => {
    const erros = validationResult(req);

    console.log(erros.array());

    if(!erros.isEmpty()) {
        const listaErros = erros.mapped();

        return res.status(400).render("contato", {
            erros: listaErros,
            dados: req.body
        })
    }

    try {
    await envio.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: req.body.email,
        subject: `Contato pelo site: ${req.body.assunto}`,
        text: `
Nome: ${req.body.nome}
E-mail: ${req.body.email}
Telefone: ${req.body.telefone}
Assunto: ${req.body.assunto}

Mensagem:
${req.body.mensagem}
        `
    });

    res.send("Mensagem enviada com sucesso.");
} catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);
    res.status(500).send(
        "Não foi possível enviar a mensagemen, tente novamente."
    );
}
});

const envio = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    requireTLS: true
});

module.exports = router;