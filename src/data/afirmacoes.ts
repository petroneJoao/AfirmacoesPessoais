// src/data/afirmacoes.ts
export interface Afirmacao {
    id: string;
    texto: string;
    categoria: 'vida_amorosa' | 'pessoal' | 'emprego' | 'dinheiro' | 'personalizada';
  }
  
  export const afirmacoes: Afirmacao[] = [
    // Vida Amorosa
    {
      id: 'amor_1',
      texto: 'Eu mereço amor verdadeiro e genuíno.',
      categoria: 'vida_amorosa'
    },
    {
      id: 'amor_2',
      texto: 'Estou aberto para relacionamentos saudáveis e transformadores.',
      categoria: 'vida_amorosa'
    },
  
    // Pessoal
    {
      id: 'pessoal_1',
      texto: 'Eu sou capaz de superar qualquer desafio.',
      categoria: 'pessoal'
    },
    {
      id: 'pessoal_2',
      texto: 'Cada dia sou uma versão melhor de mim mesmo.',
      categoria: 'pessoal'
    },
  
    // Emprego
    {
      id: 'emprego_1',
      texto: 'Minhas habilidades profissionais estão em constante crescimento.',
      categoria: 'emprego'
    },
    {
      id: 'emprego_2',
      texto: 'Sou capaz de criar oportunidades incríveis na minha carreira.',
      categoria: 'emprego'
    },
  
    // Dinheiro
    {
      id: 'dinheiro_1',
      texto: 'Dinheiro flui abundantemente para minha vida.',
      categoria: 'dinheiro'
    },
    {
      id: 'dinheiro_2',
      texto: 'Estou alinhado com a abundância financeira.',
      categoria: 'dinheiro'
    }
  ];
  
  export const categorias = [
    { id: 'vida_amorosa', nome: 'Vida Amorosa' },
    { id: 'pessoal', nome: 'Desenvolvimento Pessoal' },
    { id: 'emprego', nome: 'Carreira e Emprego' },
    { id: 'dinheiro', nome: 'Prosperidade Financeira' }
  ];