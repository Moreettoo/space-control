# Central de Monitoramento de Missões Espaciais — Módulo de Formulário

Aplicativo **React Native + Expo** que simula a central de controle de uma missão
espacial. Este repositório entrega o **módulo de formulário de missão** — a tela de
**registro e atualização de dados** com validação completa e persistência local,
correspondente ao requisito _"Formulários com validação para entrada e atualização de
dados"_ da proposta.

> Disciplina: **Cross-Platform Application Development** · Ciência da Computação

---

## ✨ O que está implementado

- **Formulário de Registro / Atualização de Missão** com tema visual "mission control"
  (deep space, acento de telemetria em ciano, tipografia de painel).
- **Validação de campos** completa, cobrindo as três categorias pedidas:
  - **Obrigatoriedade** — todos os campos marcados como `OBRIG.`
  - **Formato** — código de designação (`AAA-00`) e data (`DD/MM/AAAA`, data real do calendário)
  - **Limites** — tripulantes (1–12) e altitude orbital (150–40.000 km)
- **Validação em tempo real**: no _blur_ do campo e no envio, com foco/scroll
  automático para o primeiro erro.
- **Persistência local com AsyncStorage**: ao enviar, a missão é salva; ao reabrir, o
  último registro é carregado para demonstrar o fluxo de **atualização**.
- **Navegação com Expo Router** (`src/app`).
- **Acessibilidade**: rótulos acessíveis, grupos de rádio, regiões _live_ para erros,
  teclados semânticos e respeito a _reduzir movimento_.

| Campo | Validação |
|---|---|
| Nome da missão | obrigatório · 3–60 caracteres |
| Código de designação | obrigatório · formato `AAA-00` (ex.: `ARES-09`) |
| Comandante | obrigatório · 3–60 · apenas letras |
| Data de lançamento | obrigatório · `DD/MM/AAAA` · data válida (1957–2100) |
| Tripulantes | obrigatório · inteiro 1–12 |
| Altitude orbital | obrigatório · 150–40.000 km |
| Status | obrigatório · Planejada / Em órbita / Crítica / Concluída |
| Prioridade | obrigatório · Rotina / Elevada / Crítica |
| Observações | opcional · até 200 caracteres |

---

## 🚀 Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o app
npx expo start
```

No terminal, abra em um **emulador Android**, **simulador iOS**, no **Expo Go**
(escaneando o QR Code) ou na **web** com `npm run web`.

---

## 🗂️ Estrutura

```
src/
├── app/
│   ├── _layout.tsx        # Stack do Expo Router (tema escuro)
│   └── index.tsx          # Tela do formulário de missão
├── components/            # Componentes de UI isolados
│   ├── TextField.tsx      # Input com label, contador, estados de foco/erro
│   ├── SegmentedField.tsx # Seletor segmentado (status / prioridade)
│   ├── FormSection.tsx    # Cartão de seção numerada
│   ├── PrimaryButton.tsx  # Ação principal (com estado de carregamento)
│   ├── Header.tsx · SuccessBanner.tsx · Background.tsx · Appear.tsx · GhostButton.tsx
└── lib/                   # Lógica sem UI
    ├── validation.ts      # Regras de validação (funções puras)
    ├── storage.ts         # Helpers do AsyncStorage
    ├── types.ts · options.ts · format.ts · theme.ts · useReducedMotion.ts
```

---

## 🛠️ Tecnologias

- Expo SDK 56 · React Native 0.85 · React 19
- Expo Router (roteamento) · TypeScript (modo estrito)
- `@react-native-async-storage/async-storage` · `expo-linear-gradient`
- Validação própria (sem bibliotecas externas de formulário)

---

## 👥 Equipe

| Nome completo | RM |
|---|---|
| _Preencher_ | _RMxxxxx_ |
| _Preencher_ | _RMxxxxx_ |
| _Preencher_ | _RMxxxxx_ |
