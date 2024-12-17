import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import moment from 'moment';

// Para utilizar o __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DelayManager {
    constructor(dbFilePath) {
        this.dbFilePath = dbFilePath
    }

    #readDatabase() {
        try {
            if (fs.existsSync(this.dbFilePath)) {
                const fileData = fs.readFileSync(this.dbFilePath, 'utf-8');
                return JSON.parse(fileData);
            } else {
                throw new Error('Arquivo JSON não encontrado');
            }
        } catch (err) {
            console.error('Erro ao ler o banco de dados:', err.message);
            throw err;
        }
    }

    // Método privado para salvar no banco de dados JSON
    #saveDatabase(data) {
        try {
            fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('Erro ao salvar no banco de dados:', err.message);
            throw err;
        }
    }

    #updateEntry(newEntry) {
        let data = this.#readDatabase();
        const old = this.findLateEntryById(newEntry.id)
        let i = -1

        data.forEach(entry => {
            if (entry == old) {
                i = i
            } else {
                i++
            }
        });

        if (i == -1) {
            console.error(`Registro ${old.id} não encontrado`);
            throw new Error(`Registro ${old.id} não encontrado`);
        } else {
            data[i] = newEntry
            this.#saveDatabase(data)
        }
    }

    #closeEntry(id) {
        const lateEntry = this.findLateEntryById(id)
        if (lateEntry && lateEntry.status == "pendente") {
            lateEntry.status = 'Não informado'
            console.log(`Atraso id: ${lateEntry.id} foi fechado.`)
            this.#updateEntry(lateEntry)
        }

    }

    findLateEntryById(id) {
        const data = this.#readDatabase();
        const lateEntry = data.filter(entry => entry.id === id);

        if (lateEntry.length > 0) {
            return lateEntry[0]
        } else {
            return null
        }
    }

    registerLateEntry(userId, delay) {
        const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        let data = this.#readDatabase()

        const newLateEntry = {
            id,
            userId,
            horario_entrada: moment().format('LT'),
            atraso: delay,
            status: 'pendente',
            informacoesRedirecionamento: {}
        }

        data.push(newLateEntry);
        this.#saveDatabase(data);

        setTimeout(() => { console.log('fechando'); this.#closeEntry(id) }, 20 * 60 * 1000)

        return id
    }

    validateEntry(lateEntryId, responsavel, professor, horario, data, motivo) {
        let dados = this.#readDatabase()
        const lateEntry = this.findLateEntryById(lateEntryId)

        if (!lateEntry) {
            return [null, 'Registro não encontrado', 404]
        }

        if (lateEntry.status != 'pendente') {
            // O atraso não pode ser validado
            return [null, `Atraso não pode ser validado, status atual: ${lateEntry.status}`, 400]
        }
        if (lateEntry) {
            lateEntry.status = 'OK'
            lateEntry.informacoesRedirecionamento = {
                encaminhado_por: responsavel,
                professor,
                horario,
                motivo,
                data
            }

            try {
                this.#updateEntry(lateEntry)
                return [lateEntry, null, 200]
            } catch (error) {
                return [null, `Não foi possível validar o atraso ${lateEntry.id}`, 500]
            }
        }

    }
}

// Caminho do arquivo JSON
const dbFilePath = path.join(__dirname, '../db/lateentrys.json');

// Exporta a instância do UserManager
export const delayManager = new DelayManager(dbFilePath);