-- =====================================================
-- Financial Wallet MVP - Database Schema
-- PostgreSQL 16 with UUID v7 + LGPD Compliance
-- =====================================================

-- Enable UUID extension for v7 support
CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";

-- =====================================================
-- ENUMS DOCUMENTATION
-- Status values are stored as SMALLINT for performance
-- =====================================================

-- User Status:
-- 1 = active
-- 2 = inactive
-- 3 = blocked

-- Wallet Status:
-- 1 = active
-- 2 = inactive
-- 3 = blocked

-- Transaction Type:
-- 1 = deposit
-- 2 = transfer
-- 3 = reversal

-- Transaction Status:
-- 1 = pending
-- 2 = processing
-- 3 = completed
-- 4 = failed
-- 5 = reversed

-- Archive Reason:
-- 1 = user_request (solicitação do usuário)
-- 2 = lgpd_compliance (direito ao esquecimento)
-- 3 = account_closure (encerramento de conta)
-- 4 = fraud_detection (detecção de fraude)
-- 5 = inactivity (inatividade prolongada)
-- 6 = administrative (motivo administrativo)

-- =====================================================
-- USERS TABLE (Active Records Only)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    document VARCHAR(14) UNIQUE NOT NULL, -- CPF/CNPJ
    phone VARCHAR(20),
    status SMALLINT DEFAULT 1 NOT NULL CHECK (status IN (1, 2, 3)),
    -- 1=active, 2=inactive, 3=blocked
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_document ON users(document);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- USERS HISTORY TABLE (LGPD Compliance - Immutable)
-- =====================================================
CREATE TABLE users_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    original_user_id UUID NOT NULL, -- Reference to original user ID
    
    -- User data snapshot
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    document VARCHAR(14) NOT NULL,
    phone VARCHAR(20),
    status SMALLINT NOT NULL,
    email_verified_at TIMESTAMP,
    
    -- Archive metadata
    archive_reason SMALLINT NOT NULL CHECK (archive_reason IN (1, 2, 3, 4, 5, 6)),
    -- 1=user_request, 2=lgpd_compliance, 3=account_closure, 
    -- 4=fraud_detection, 5=inactivity, 6=administrative
    archive_description TEXT,
    archived_by UUID, -- User/Admin who performed the archive
    archived_by_ip INET,
    
    -- Original timestamps
    original_created_at TIMESTAMP NOT NULL,
    original_updated_at TIMESTAMP NOT NULL,
    
    -- Archive timestamp
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for history queries
CREATE INDEX idx_users_history_original_id ON users_history(original_user_id);
CREATE INDEX idx_users_history_email ON users_history(email);
CREATE INDEX idx_users_history_document ON users_history(document);
CREATE INDEX idx_users_history_archived_at ON users_history(archived_at DESC);
CREATE INDEX idx_users_history_archive_reason ON users_history(archive_reason);

-- =====================================================
-- WALLETS TABLE (Active Records Only)
-- =====================================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL' NOT NULL,
    status SMALLINT DEFAULT 1 NOT NULL CHECK (status IN (1, 2, 3)),
    -- 1=active, 2=inactive, 3=blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_currency UNIQUE(user_id, currency)
);

-- Indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_status ON wallets(status);
CREATE INDEX idx_wallets_balance ON wallets(balance);

-- =====================================================
-- WALLETS HISTORY TABLE (LGPD Compliance - Immutable)
-- =====================================================
CREATE TABLE wallets_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    original_wallet_id UUID NOT NULL,
    original_user_id UUID NOT NULL,
    
    -- Wallet data snapshot
    balance DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status SMALLINT NOT NULL,
    
    -- Archive metadata
    archive_reason SMALLINT NOT NULL CHECK (archive_reason IN (1, 2, 3, 4, 5, 6)),
    archive_description TEXT,
    archived_by UUID,
    archived_by_ip INET,
    
    -- Original timestamps
    original_created_at TIMESTAMP NOT NULL,
    original_updated_at TIMESTAMP NOT NULL,
    
    -- Archive timestamp
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_wallets_history_original_id ON wallets_history(original_wallet_id);
CREATE INDEX idx_wallets_history_original_user_id ON wallets_history(original_user_id);
CREATE INDEX idx_wallets_history_archived_at ON wallets_history(archived_at DESC);

-- =====================================================
-- TRANSACTIONS TABLE (Immutable - Never Delete)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (1, 2, 3)),
    -- 1=deposit, 2=transfer, 3=reversal
    status SMALLINT DEFAULT 1 NOT NULL CHECK (status IN (1, 2, 3, 4, 5)),
    -- 1=pending, 2=processing, 3=completed, 4=failed, 5=reversed
    
    -- Sender information (nullable for deposits)
    sender_wallet_id UUID, -- No FK to allow history
    sender_user_id UUID, -- Denormalized for reporting
    sender_previous_balance DECIMAL(15, 2),
    sender_new_balance DECIMAL(15, 2),
    
    -- Receiver information
    receiver_wallet_id UUID, -- No FK to allow history
    receiver_user_id UUID, -- Denormalized for reporting
    receiver_previous_balance DECIMAL(15, 2),
    receiver_new_balance DECIMAL(15, 2),
    
    -- Transaction details
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'BRL' NOT NULL,
    description TEXT,
    metadata JSONB,
    
    -- Reversal tracking
    reversed_transaction_id UUID REFERENCES transactions(id),
    reversal_reason TEXT,
    
    -- Timestamps
    completed_at TIMESTAMP,
    reversed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_transaction_wallets CHECK (
        (type = 1 AND sender_wallet_id IS NULL AND receiver_wallet_id IS NOT NULL) OR -- deposit
        (type = 2 AND sender_wallet_id IS NOT NULL AND receiver_wallet_id IS NOT NULL AND sender_wallet_id != receiver_wallet_id) OR -- transfer
        (type = 3 AND reversed_transaction_id IS NOT NULL) -- reversal
    )
);

-- Indexes
CREATE INDEX idx_transactions_sender_wallet ON transactions(sender_wallet_id);
CREATE INDEX idx_transactions_receiver_wallet ON transactions(receiver_wallet_id);
CREATE INDEX idx_transactions_sender_user ON transactions(sender_user_id);
CREATE INDEX idx_transactions_receiver_user ON transactions(receiver_user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reversed_id ON transactions(reversed_transaction_id);
CREATE INDEX idx_transactions_type_status ON transactions(type, status);

-- GIN index for JSONB metadata queries
CREATE INDEX idx_transactions_metadata ON transactions USING GIN (metadata);

-- =====================================================
-- TRANSACTION LOGS TABLE (Audit Trail - Immutable)
-- =====================================================
CREATE TABLE transaction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    previous_status SMALLINT,
    new_status SMALLINT NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- created, processing, completed, failed, reversed
    error_message TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transaction_logs_transaction_id ON transaction_logs(transaction_id);
CREATE INDEX idx_transaction_logs_created_at ON transaction_logs(created_at DESC);
CREATE INDEX idx_transaction_logs_event_type ON transaction_logs(event_type);

-- GIN index for JSONB metadata
CREATE INDEX idx_transaction_logs_metadata ON transaction_logs USING GIN (metadata);

-- =====================================================
-- LGPD AUDIT LOG (Required for Compliance)
-- =====================================================
CREATE TABLE lgpd_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    entity_type VARCHAR(50) NOT NULL, -- users, wallets, transactions
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- archive, anonymize, export, delete
    reason SMALLINT, -- Links to archive_reason enum
    description TEXT,
    performed_by UUID, -- User/Admin ID
    performed_by_ip INET,
    user_agent TEXT,
    metadata JSONB, -- Additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_lgpd_audit_entity ON lgpd_audit_log(entity_type, entity_id);
CREATE INDEX idx_lgpd_audit_action ON lgpd_audit_log(action);
CREATE INDEX idx_lgpd_audit_created_at ON lgpd_audit_log(created_at DESC);
CREATE INDEX idx_lgpd_audit_performed_by ON lgpd_audit_log(performed_by);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to archive user (moves to history)
CREATE OR REPLACE FUNCTION archive_user(
    p_user_id UUID,
    p_reason SMALLINT,
    p_description TEXT DEFAULT NULL,
    p_archived_by UUID DEFAULT NULL,
    p_archived_by_ip INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_record users%ROWTYPE;
    v_wallet_record RECORD;
BEGIN
    -- Get user data
    SELECT * INTO v_user_record FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;
    
    -- Insert into users_history
    INSERT INTO users_history (
        original_user_id, name, email, document, phone, status,
        email_verified_at, archive_reason, archive_description,
        archived_by, archived_by_ip, original_created_at, original_updated_at
    ) VALUES (
        v_user_record.id, v_user_record.name, v_user_record.email,
        v_user_record.document, v_user_record.phone, v_user_record.status,
        v_user_record.email_verified_at, p_reason, p_description,
        p_archived_by, p_archived_by_ip, v_user_record.created_at, v_user_record.updated_at
    );
    
    -- Archive all user wallets
    FOR v_wallet_record IN SELECT * FROM wallets WHERE user_id = p_user_id LOOP
        INSERT INTO wallets_history (
            original_wallet_id, original_user_id, balance, currency, status,
            archive_reason, archive_description, archived_by, archived_by_ip,
            original_created_at, original_updated_at
        ) VALUES (
            v_wallet_record.id, p_user_id, v_wallet_record.balance,
            v_wallet_record.currency, v_wallet_record.status, p_reason,
            p_description, p_archived_by, p_archived_by_ip,
            v_wallet_record.created_at, v_wallet_record.updated_at
        );
    END LOOP;
    
    -- Log LGPD action
    INSERT INTO lgpd_audit_log (
        entity_type, entity_id, action, reason, description,
        performed_by, performed_by_ip
    ) VALUES (
        'users', p_user_id, 'archive', p_reason, p_description,
        p_archived_by, p_archived_by_ip
    );
    
    -- Delete wallets (CASCADE will handle)
    DELETE FROM wallets WHERE user_id = p_user_id;
    
    -- Delete user
    DELETE FROM users WHERE id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Active user balances view
CREATE OR REPLACE VIEW v_user_balances AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    w.id as wallet_id,
    w.balance,
    w.currency,
    w.status as wallet_status,
    u.status as user_status,
    u.created_at,
    u.updated_at
FROM users u
INNER JOIN wallets w ON u.id = w.user_id;

-- Transaction summary view
CREATE OR REPLACE VIEW v_transaction_summary AS
SELECT 
    DATE(t.created_at) as transaction_date,
    t.type,
    CASE t.type
        WHEN 1 THEN 'deposit'
        WHEN 2 THEN 'transfer'
        WHEN 3 THEN 'reversal'
    END as type_name,
    t.status,
    CASE t.status
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'processing'
        WHEN 3 THEN 'completed'
        WHEN 4 THEN 'failed'
        WHEN 5 THEN 'reversed'
    END as status_name,
    COUNT(*) as total_transactions,
    SUM(t.amount) as total_amount,
    AVG(t.amount) as average_amount,
    t.currency
FROM transactions t
GROUP BY DATE(t.created_at), t.type, t.status, t.currency
ORDER BY transaction_date DESC;

-- LGPD compliance view (archived users)
CREATE OR REPLACE VIEW v_archived_users_summary AS
SELECT 
    uh.archive_reason,
    CASE uh.archive_reason
        WHEN 1 THEN 'user_request'
        WHEN 2 THEN 'lgpd_compliance'
        WHEN 3 THEN 'account_closure'
        WHEN 4 THEN 'fraud_detection'
        WHEN 5 THEN 'inactivity'
        WHEN 6 THEN 'administrative'
    END as reason_name,
    COUNT(*) as total_archived,
    DATE(uh.archived_at) as archive_date
FROM users_history uh
GROUP BY uh.archive_reason, DATE(uh.archived_at)
ORDER BY archive_date DESC;

-- =====================================================
-- SEED DATA FOR TESTING
-- =====================================================

-- Insert test users (password is 'password' hashed with bcrypt)
INSERT INTO users (name, email, password, document, phone, status, email_verified_at)
VALUES 
    ('João Silva', 'joao@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678901', '11987654321', 1, CURRENT_TIMESTAMP),
    ('Maria Santos', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '98765432109', '11912345678', 1, CURRENT_TIMESTAMP);

-- Insert wallets for test users
INSERT INTO wallets (user_id, balance, currency, status)
SELECT id, 1000.00, 'BRL', 1 FROM users WHERE email = 'joao@example.com'
UNION ALL
SELECT id, 500.00, 'BRL', 1 FROM users WHERE email = 'maria@example.com';

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Active user accounts only - archived users moved to users_history';
COMMENT ON TABLE users_history IS 'Immutable history of archived users for LGPD compliance';
COMMENT ON TABLE wallets IS 'Active user wallets only - archived wallets moved to wallets_history';
COMMENT ON TABLE wallets_history IS 'Immutable history of archived wallets';
COMMENT ON TABLE transactions IS 'Immutable transaction records - NEVER delete for audit trail';
COMMENT ON TABLE transaction_logs IS 'Immutable audit trail of transaction state changes';
COMMENT ON TABLE lgpd_audit_log IS 'LGPD compliance audit log - tracks all data operations';

COMMENT ON COLUMN users.document IS 'CPF or CNPJ - Brazilian tax identification number';
COMMENT ON COLUMN users.status IS '1=active, 2=inactive, 3=blocked';
COMMENT ON COLUMN wallets.status IS '1=active, 2=inactive, 3=blocked';
COMMENT ON COLUMN transactions.transaction_code IS 'Unique human-readable transaction identifier';
COMMENT ON COLUMN transactions.type IS '1=deposit, 2=transfer, 3=reversal';
COMMENT ON COLUMN transactions.status IS '1=pending, 2=processing, 3=completed, 4=failed, 5=reversed';
COMMENT ON COLUMN users_history.archive_reason IS '1=user_request, 2=lgpd_compliance, 3=account_closure, 4=fraud_detection, 5=inactivity, 6=administrative';
COMMENT ON COLUMN transactions.sender_user_id IS 'Denormalized user ID for reporting even after user archive';
COMMENT ON COLUMN transactions.receiver_user_id IS 'Denormalized user ID for reporting even after user archive';

COMMENT ON FUNCTION archive_user IS 'Archives user and all related data to history tables with LGPD compliance';
