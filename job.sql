DROP EVENT IF EXISTS `Loans_payment`;
delimiter |

CREATE EVENT `Loans_payment` 
    ON SCHEDULE
        EVERY 30 SECOND
    ENABLE
DO BEGIN

    UPDATE loans
    SET loans.rateValue = ((loans.value/loans.installments) + (loans.value - (loans.value/loans.installments) * installmentsPaid) * interestRate)
    WHERE loans.status = 'open';

    INSERT INTO repaymentRecords(loanId, paymentDate, amount)
    SELECT loans.id, NOW(), loans.rateValue
    FROM loans
    WHERE loans.status = 'open';

    UPDATE deposits
    INNER JOIN loans on loans.depositId = deposits.id
    SET deposits.balance = deposits.balance - loans.rateValue,
        loans.installmentsPaid = installmentsPaid + 1
    WHERE loans.status = 'open';

    UPDATE loans
    SET loans.status = 'closed'
    WHERE loans.installmentsPaid >= loans.installments;

END |
delimiter ;
