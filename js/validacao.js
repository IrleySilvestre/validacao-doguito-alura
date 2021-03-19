export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = exibeMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing ',
    'typeMismatch',
    'patternMismatch',
    'customError'
]
const mensagensDeErro = {
    nome: {
        valueMissing: 'Campo nome não pode ser vazio.'
    },
    email: {
        valueMissing: 'Campo email não pode ser vazio.',
        typeMismatch: 'Email digitado não é válido'
    },
    senha: {
        valueMissing: 'Campo senha não pode ser vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'Campo data de nascimento não pode ser vazio.',
        customError: 'Cadastro permitido somenta para maiores de 18 anos'
    },
    cpf: {
        valueMissing: 'Campo CPF de nascimento não pode ser vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'Campo CEP não pode ser vazio.',
        patternMismatch: 'Cep digitado não é valido',
        customError: 'CEP não localizado.'
    },
    logradouro: {
        valueMissing: 'Campo logradouro não pode ser vazio.'
    },
    cidade: {
        valueMissing: 'Campo cidade não pode ser vazio.'
    },
    estado: {
        valueMissing: 'Campo estado não pode ser vazio.'
    },
    preco: {
        valueMissing: 'Campo preco não pode ser vazio.'
    }
}

const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCPF(input),
    cep: input => pesquisarCep(input)

}

function exibeMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {

        if (input.validity[erro]) {

            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}


function validaDataNascimento(input) {

    const dataRecebida = new Date(input.value)

    let mensagem = ''

    if (!maiorQue18(dataRecebida)) {
        mensagem = ('Cadastro permitido somenta para maiores de 18 anos')
    }

    input.setCustomValidity(mensagem)

}

function maiorQue18(data) {
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())
    return dataMais18 <= dataAtual
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if (!verifiaNrRepetidos(cpfFormatado) || (!validaEstrutura(cpfFormatado))) {
        mensagem = 'O CPF digitado não é válido.'
    }

    input.setCustomValidity(mensagem)
}

function verifiaNrRepetidos(cpf) {
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") {

        return false;
    }
    return true;
}

function validaEstrutura(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    // verificando se tem a quantidade certa de caracter e se não tem todos caracteres iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
        return false;
    let soma = 0,
        resto;
    for (var i = 1; i <= 9; i++)
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;
    if (resto != parseInt(cpf.substring(9, 10)))
        return false;
    soma = 0;
    for (var i = 1; i <= 10; i++)
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
        resto = 0;
    if (resto != parseInt(cpf.substring(10, 11)))
        return false;
    return true;
}

function pesquisarCep(input) {
    const cep = input.value.replace(/\D/g, '')

    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if (data.error) {
                    input.setCustomValidity('CEP não localizado.')
                    return
                }
                input.setCustomValidity('')
                preenchComposEndereco(data)
                return
            }
        )
    }
}

function preenchComposEndereco(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}

