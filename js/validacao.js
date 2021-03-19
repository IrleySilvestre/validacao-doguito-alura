export function valida (input){
    const tipoDeInput = input.dataset.tipo

    if (validadores[tipoDeInput]){
        validadores[tipoDeInput](input)
    }

    if (input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    }else {
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
    nome:{
        valueMissing : 'Campo nome não pode ser vazio.'
    },
    email:{
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
    }
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
}

function exibeMensagemDeErro(tipoDeInput, input) {
    let  mensagem = ''
    tiposDeErro.forEach(erro =>{
        console.log(input)
        if(input.validity[erro]){

            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}


function validaDataNascimento(input){

    const dataRecebida = new Date(input.value)

    let mensagem = ''

    if (!maiorQue18(dataRecebida)){
        mensagem = ('Cadastro permitido somenta para maiores de 18 anos')
    }

    input.setCustomValidity(mensagem)

}

function maiorQue18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear()+18, data.getUTCMonth(), data.getUTCDate())
    return dataMais18 <= dataAtual
}