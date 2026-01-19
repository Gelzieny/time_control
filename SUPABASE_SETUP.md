# Configuração do Banco de Dados Supabase

## Passo 1: Criar Tabela no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Copie e execute o SQL do arquivo `supabase-schema.sql`

Ou execute este SQL diretamente:

```sql
-- Criar tabela de lançamentos de ponto
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia INTEGER NOT NULL,
  entrada1 TIME,
  saida1 TIME,
  entrada2 TIME,
  saida2 TIME,
  total_horas VARCHAR(10),
  saldo VARCHAR(10),
  ocorrencia VARCHAR(255),
  motivo TEXT,
  dia_semana VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_time_entries_dia ON time_entries(dia);
CREATE INDEX idx_time_entries_created_at ON time_entries(created_at);

-- Habilitar Row Level Security
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Política de acesso (permitir todas operações)
CREATE POLICY "Enable all operations for all users" ON time_entries
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Passo 2: Configurar Variáveis de Ambiente

As variáveis já estão configuradas em `.env.local`:

```env
VITE_SUPABASE_URL=https://spociiyxwtfmyvetarna.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_RxdCYZ8VonZOevNukZBu0A_WZyzAuhf
```

## Passo 3: Instalar Dependências

```bash
pnpm install @supabase/supabase-js
```

## Estrutura de Dados

A tabela `time_entries` possui os seguintes campos:

- **id**: UUID (chave primária, gerado automaticamente)
- **dia**: Número do dia do mês (1-31)
- **entrada1**: Horário de entrada 1
- **saida1**: Horário de saída 1
- **entrada2**: Horário de entrada 2
- **saida2**: Horário de saída 2
- **total_horas**: Total de horas trabalhadas
- **saldo**: Saldo de horas
- **ocorrencia**: Observações sobre ocorrências
- **motivo**: Motivo de ausência ou observação
- **dia_semana**: Dia da semana (Dom, Seg, Ter, etc)
- **created_at**: Data de criação
- **updated_at**: Data de atualização

## Uso no Código

O hook `useTimeEntries` gerencia todas as operações CRUD:

```tsx
import { useTimeEntries } from './hooks/useTimeEntries';

const { 
  entries,      // Lista de lançamentos
  loading,      // Estado de carregamento
  error,        // Mensagem de erro
  createEntry,  // Criar novo lançamento
  updateEntry,  // Atualizar lançamento
  deleteEntry,  // Deletar lançamento
  refetch       // Recarregar dados
} = useTimeEntries();
```

## Testando a Integração

1. Inicie o servidor: `pnpm dev`
2. Abra o navegador em `http://localhost:5173`
3. Clique em "Novo Lançamento" para adicionar um registro
4. Verifique no Supabase Dashboard se o registro foi criado

## Troubleshooting

Se encontrar erros:

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que a tabela foi criada no Supabase
3. Verifique as políticas de Row Level Security
4. Confira o console do navegador para mensagens de erro
