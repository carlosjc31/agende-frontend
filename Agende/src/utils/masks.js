// src/utils/masks.js

// 1. MÁSCARA DE DATA (DD/MM/AAAA)
export const maskDate = (value) => {
  if (!value) return '';
  // Limpa tudo que não for número
  let v = String(value).replace(/\D/g, '');

  // Fatiamento seguro
  if (v.length <= 2) return v;
  if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
};

// 2. MÁSCARA DE CPF (000.000.000-00)
export const maskCPF = (value) => {
  if (!value) return '';
  // Garante que só temos números para trabalhar
  const v = String(value).replace(/\D/g, '');

  // Aplica a máscara com Regex direto no texto final
  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
};

// 3. MÁSCARA DE TELEFONE ((00) 00000-0000)
export const maskPhone = (value) => {
  if (!value) return '';
  // Limpa tudo que não for número
  let v = String(value).replace(/\D/g, '');

  // Fatiamento seguro progressivo
  if (v.length <= 2) return v;
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
};

