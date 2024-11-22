import { createHash } from "crypto";

export function criarHash(conteudo, salt) {
    return createHash('sha256').update(`${conteudo};${salt}`).digest('base64');
}

export function criarSalt() {
    return Math.random().toString(36).substring(2, 18);
}