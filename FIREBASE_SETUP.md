# Configuração do Firebase - Carro Na Mídia

## Visão Geral

Este projeto agora está integrado com Firebase Firestore para gerenciar o estoque de carros. O sistema funciona com dados de fallback quando o Firebase não está disponível.

## Schema dos Dados

### Coleção: `cars`

Cada documento na coleção `cars` deve ter a seguinte estrutura:

```typescript
interface Car {
  id: string;              // ID único do documento
  brand: string;           // Marca do carro (ex: "BMW", "Ferrari")
  model: string;           // Modelo (ex: "M4 Competition", "488 GTB")
  year: number;            // Ano de fabricação
  price: number;           // Preço em reais (ex: 650000)
  image: string;           // URL da imagem do carro
  mileage: number;         // Quilometragem
  fuel: string;            // Tipo de combustível (ex: "Gasolina")
  transmission: string;    // Tipo de transmissão (ex: "Automático")
  featured?: boolean;      // Se é um carro em destaque (opcional)
  
  // Campos opcionais adicionais:
  status?: 'available' | 'sold' | 'reserved';
  description?: string;
  color?: string;
  engine?: string;
  doors?: number;
  location?: string;
}
```

## Configuração

### 1. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis com suas credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

### 2. Configurar Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o Firestore Database
4. Configure as regras de segurança (exemplo para desenvolvimento):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /cars/{document} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### 3. Adicionar Dados de Exemplo

Você pode adicionar carros manualmente no Firebase Console ou usar este script:

```javascript
// Exemplo de documento para adicionar na coleção 'cars'
{
  brand: "BMW",
  model: "M4 Competition",
  year: 2023,
  price: 650000,
  image: "https://exemplo.com/bmw-m4.jpg",
  mileage: 2500,
  fuel: "Gasolina",
  transmission: "Automático",
  featured: true,
  status: "available",
  color: "Azul",
  engine: "3.0L Twin Turbo",
  doors: 2
}
```

## Funcionalidades

### Hooks Disponíveis

1. **`useCars()`** - Busca todos os carros
2. **`useFilteredCars(filters)`** - Busca carros com filtros aplicados
3. **`useFeaturedCars()`** - Busca apenas carros em destaque

### Serviços Firebase

- `getAllCars()` - Busca todos os carros
- `getFeaturedCars()` - Busca carros em destaque
- `getCarsByBrand(brand)` - Busca por marca
- `getCarsByPriceRange(min, max)` - Busca por faixa de preço
- `getCarById(id)` - Busca carro específico
- `getFilteredCars(filters)` - Busca com filtros complexos

## Modo Offline

O sistema funciona automaticamente em modo offline quando:
- Firebase não está configurado
- Não há conexão com internet
- Ocorre erro na consulta

Nestes casos, dados de fallback são utilizados e um aviso é exibido ao usuário.

## Estrutura de Arquivos

```
src/
├── services/
│   └── firebase.ts          # Configuração e serviços Firebase
├── hooks/
│   └── useCars.ts           # Hooks para gerenciar dados dos carros
└── components/
    └── CarGrid.tsx          # Componente atualizado com Firebase
```

## Instalação das Dependências

```bash
npm install firebase
```

## Desenvolvimento

Para desenvolvimento local:

1. Configure as variáveis de ambiente
2. Execute o projeto: `npm run dev`
3. O sistema funcionará com dados de fallback se o Firebase não estiver configurado

## Produção

Para produção:

1. Configure todas as variáveis de ambiente no seu provedor de hospedagem
2. Configure as regras de segurança adequadas no Firestore
3. Faça o build: `npm run build`

## Troubleshooting

### Erro: "Firebase not configured"
- Verifique se todas as variáveis de ambiente estão definidas
- Confirme se o projeto Firebase está ativo

### Dados não aparecem
- Verifique as regras de segurança do Firestore
- Confirme se a coleção 'cars' existe e tem documentos
- Verifique o console do navegador para erros

### Modo offline permanente
- Verifique a conexão com internet
- Confirme as credenciais do Firebase
- Verifique se o Firestore está habilitado no projeto