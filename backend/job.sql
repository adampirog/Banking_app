SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS `Loans_payment`;
delimiter |

CREATE EVENT `Loans_payment` 
    ON SCHEDULE
        EVERY 30 SECOND     -- before deployment change testing value to 30 DAY
    ENABLE
DO BEGIN

    -- add to liablity
    UPDATE accounts
    SET accounts.balance = accounts.balance + 
        (
            SELECT (loans.value/loans.installments)
            FROM loans
            WHERE loans.status = 'open'
        )
    WHERE accounts.description = 'liability';

    -- substract from asset
    UPDATE accounts
    SET accounts.balance = accounts.balance - 
        (
            SELECT (loans.value/loans.installments)
            FROM loans
            WHERE loans.status = 'open'
        )
    WHERE accounts.description = 'asset';

    -- add to bank income
    UPDATE accounts
    SET accounts.balance = accounts.balance + 
        (
            SELECT (loans.value - (loans.value/loans.installments) * installmentsPaid) * interestRate
            FROM loans
            WHERE loans.status = 'open'
        )
    WHERE accounts.description = 'income';

    -- calculate interest
    UPDATE loans
    SET loans.rateValue = ((loans.value/loans.installments) + (loans.value - (loans.value/loans.installments) * installmentsPaid) * interestRate)
    WHERE loans.status = 'open';

    -- create record in repaymentRecords
    INSERT INTO repaymentRecords(loanId, paymentDate, amount)
    SELECT loans.id, NOW(), loans.rateValue
    FROM loans
    WHERE loans.status = 'open';

    -- charge clients deposit
    UPDATE deposits
    INNER JOIN loans on loans.depositId = deposits.id
    SET deposits.balance = deposits.balance - loans.rateValue,
        loans.installmentsPaid = installmentsPaid + 1
    WHERE loans.status = 'open';

    -- check for fully payed loans
    UPDATE loans
    SET loans.status = 'closed'
    WHERE loans.installmentsPaid >= loans.installments;

END |
delimiter ;
