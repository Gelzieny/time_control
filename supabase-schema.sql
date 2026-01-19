-- ============================================
-- SCHEMA PARA SISTEMA DE CONTROLE DE PONTO
-- Database: PostgreSQL / Supabase
-- ============================================

-- Limpar objetos existentes (opcional - use com cuidado)
-- DROP TABLE IF EXISTS time_entries CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- TABELA: time_entries
-- Armazena os lançamentos de ponto dos funcionários
-- ============================================
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 31),
  entrada1 TIME,
  saida1 TIME,
  entrada2 TIME,
  saida2 TIME,
  total_horas VARCHAR(10),
  saldo VARCHAR(10),
  ocorrencia VARCHAR(255),
  motivo TEXT,
  dia_semana VARCHAR(10) NOT NULL CHECK (dia_semana IN ('Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMENTÁRIOS NA TABELA
-- ============================================
COMMENT ON TABLE time_entries IS 'Lançamentos de ponto dos funcionários';
COMMENT ON COLUMN time_entries.id IS 'Identificador único do lançamento';
COMMENT ON COLUMN time_entries.dia IS 'Dia do mês (1-31)';
COMMENT ON COLUMN time_entries.entrada1 IS 'Horário da primeira entrada';
COMMENT ON COLUMN time_entries.saida1 IS 'Horário da primeira saída';
COMMENT ON COLUMN time_entries.entrada2 IS 'Horário da segunda entrada';
COMMENT ON COLUMN time_entries.saida2 IS 'Horário da segunda saída';
COMMENT ON COLUMN time_entries.total_horas IS 'Total de horas trabalhadas no dia';
COMMENT ON COLUMN time_entries.saldo IS 'Saldo de horas (positivo ou negativo)';
COMMENT ON COLUMN time_entries.ocorrencia IS 'Observações sobre ocorrências';
COMMENT ON COLUMN time_entries.motivo IS 'Motivo de ausência, banco de horas, etc';
COMMENT ON COLUMN time_entries.dia_semana IS 'Dia da semana';

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_time_entries_dia ON time_entries(dia);
CREATE INDEX IF NOT EXISTS idx_time_entries_dia_semana ON time_entries(dia_semana);
CREATE INDEX IF NOT EXISTS idx_time_entries_created_at ON time_entries(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Política: Permitir todas operações para todos usuários
-- ATENÇÃO: Em produção, ajuste as políticas conforme necessário
DROP POLICY IF EXISTS "Enable all operations for all users" ON time_entries;
CREATE POLICY "Enable all operations for all users" ON time_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Exemplo de política mais restritiva (comentado):
-- CREATE POLICY "Users can view all entries" ON time_entries
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Users can insert own entries" ON time_entries
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: update_updated_at_column
-- Atualiza automaticamente a coluna updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Atualiza automaticamente o campo updated_at';

-- ============================================
-- TRIGGER: update_time_entries_updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS DE EXEMPLO (opcional)
-- ============================================
-- Inserir alguns lançamentos de exemplo
INSERT INTO time_entries (dia, entrada1, saida1, entrada2, saida2, total_horas, saldo, dia_semana)
VALUES
  (1, '08:00', '12:00', '13:00', '17:00', '08:00', '00:00', 'Qui'),
  (2, '08:15', '12:10', '13:05', '17:30', '08:20', '00:20', 'Sex'),
  (3, NULL, NULL, NULL, NULL, NULL, NULL, 'Sáb')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VIEWS (opcional)
-- ============================================
-- View para relatórios com totalizadores
CREATE OR REPLACE VIEW vw_time_entries_summary AS
SELECT 
  dia,
  dia_semana,
  entrada1,
  saida1,
  entrada2,
  saida2,
  total_horas,
  saldo,
  CASE 
    WHEN entrada1 IS NULL THEN 'Sem registro'
    WHEN total_horas >= '08:00' THEN 'Completo'
    ELSE 'Incompleto'
  END as status,
  created_at
FROM time_entries
ORDER BY dia;

COMMENT ON VIEW vw_time_entries_summary IS 'Resumo dos lançamentos de ponto com status';

-- ============================================
-- GRANTS (ajuste conforme necessário)
-- ============================================
-- GRANT ALL ON time_entries TO authenticated;
-- GRANT ALL ON time_entries TO service_role;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

