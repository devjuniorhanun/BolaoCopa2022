## 💻 Projeto SisdeveBolão
Sistema de bolões da Copa do Mundo 2022

## ✨ Tecnologia

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- E muitas outras…


![GitHub](https://img.shields.io/github/license/devjuniorhanun/BolaoCopa2022)
![Twitter Follow](https://img.shields.io/twitter/follow/HanunWinston?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/devjuniorhanun/BolaoCopa2022)
![GitHub All Releases](https://img.shields.io/github/downloads/devjuniorhanun/BolaoCopa2022/total)
![GitHub language count](https://img.shields.io/github/languages/count/devjuniorhanun/BolaoCopa2022)
![GitHub top language](https://img.shields.io/github/languages/top/devjuniorhanun/BolaoCopa2022)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/devjuniorhanun/BolaoCopa2022)

<h4 align="center"> 
	🚧  Projeto 🚀 Em construção...  🚧
</h4>

#### Para instalação

### Instalação
Primeiramente clonar o projeto.
```
git clone https://github.com/devjuniorhanun/BolaoCopa2022.git nomeProjeto
```
Entra no projeto resce criado.
```
cd nomeProjeto
```
Instalação das dependencias do node.
```
cd server
npm i
cd ../web
npm i
cd ../mobili
npm i
```

## 🚀 Como executar

Gerar o arquivo .env
```
cd server
cp .env.example .env
```
Configurar o arquivo .env
```
nano .env
```
Rotando as migrates
```
npx prisma migrate dev
```
Rotando os seeds
```
npx prisma db seed
```
Rotando o servidor
```
cd server
npm run dev
```
Rotando o Web
```
cd web
npm run dev
```
Rotando o mobile
```
cd mobile
npx run dev
```
Conectar no servidor
```
http://localhost:3333
```
Conectar no web
```
http://localhost:3000
```

## Licença
Sistema open-source licenciado em [GNU GENERAL PUBLIC LICENSE](https://fsf.org/).

<p align="center">
  Feito com 💜 by Sisdeve
</p>