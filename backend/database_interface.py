from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Integer, String, TIMESTAMP, FLOAT
from sqlalchemy.orm import relationship
from passlib.hash import sha256_crypt as sha
import jwt
from functools import wraps
import random
import string

from datetime import datetime

salt = "8xVMjpoJV3"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://project:pwr2020@localhost/bank"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Nt7mP9ivQPTk'

db = SQLAlchemy(app)


class Account(db.Model):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    balance = Column(Integer, nullable=False)
    description = Column(String(150))


class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    passwordHash = Column(String(100), nullable=False)
    userType = Column(String(30), nullable=False)
    firstName = Column(String(30))
    lastName = Column(String(30))
    phone = Column(String(15))
    email = Column(String(100), nullable=False, unique=True)
    
    def __init__(self, userType, email, password):
        self.userType = userType
        self.email = email
        self.passwordHash = sha.hash(password, salt=salt)
        
    def verify(self, inputString):
        return sha.verify(inputString, self.passwordHash)
    
    def set_password(self, newPassword):
        self.passwordHash = sha.hash(newPassword, salt=salt)
        
    def get_dict(self):
        data = {'id': self.id,
                'userType': self.userType,
                'firstName': self.firstName,
                'lastName': self.lastName,
                'phone': self.phone,
                'email': self.email
                }
        
        return data


class Deposit(db.Model):
    __tablename__ = 'deposits'

    id = Column(String(28), primary_key=True)
    balance = Column(Integer, nullable=False)
    userId = Column(ForeignKey('users.id'), nullable=False, index=True)

    user = relationship('User')
    
    def __init__(self, userId):
        self.userId = userId
        self.balance = 0
        
        tmp_iban = 'PL02' + '1920' + '001'
        for _ in range(17):
            tmp_iban += random.choice(string.digits)
            
        while((Deposit.query.filter_by(id=tmp_iban).first() is not None) and (Loan.query.filter_by(id=tmp_iban).first())):
            tmp_iban = 'PL02' + '1920' + '001'
            for _ in range(17):
                tmp_iban += random.choice(string.digits)
                     
        self.id = tmp_iban
        
    def get_dict(self):
        data = {'id': self.id,
                'balance': self.balance        
                }
        return data


class Loan(db.Model):
    __tablename__ = 'loans'

    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(String(50), nullable=False)
    purpose = Column(String(150))
    
    value = Column(Integer, nullable=False)
    installments = Column(Integer, nullable=False)
    interestRate = Column(FLOAT, nullable=False)
    
    installmentsPaid = Column(Integer, nullable=False)
    
    acceptanceDate = Column(TIMESTAMP, nullable=True)
    rateValue = Column(Integer, nullable=True)
    
    depositId = Column(ForeignKey('deposits.id'), nullable=False, index=True)

    deposit = relationship('Deposit')
    
    def __init__(self, depositId, value, installments, interestRate):
        self.depositId = depositId
        self.status = "pending"
        
        self.value = value
        self.installments = installments
        self.interestRate = interestRate
        self.installmentsPaid = 0
        
        #((loans.value/loans.installmens) + (loans.value - (loans.value/loans.installmens) * installmentsPaid) * interestRate)
        self.rateValue = (self.value / self.installments) + (self.value - (self.value / self.installments) * self.installmentsPaid) * interestRate
        
    def get_dict(self):
        data = {'id': self.id,
                'depositId': self.depositId,
                'status': self.status,
                'purpose': self.purpose,
                'value': self.value,
                'installments': self.installments,
                'interestRate': self.interestRate,
                'acceptanceDate': self.acceptanceDate,
                'rateValue': self.rateValue,
                'installmentsPaid': self.installmentsPaid,
                }
        return data 
        

class Transfer(db.Model):
    __tablename__ = 'transfers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(Integer, nullable=False)
    transferDate = Column(TIMESTAMP, nullable=False, default=datetime.now)
    sender = Column(ForeignKey('deposits.id'), nullable=False, index=True)
    receiver = Column(ForeignKey('deposits.id'), nullable=False, index=True)
    description = Column(String(30))

    receiverDeposit = relationship('Deposit', primaryjoin='Transfer.receiver == Deposit.id')
    senderDeposit = relationship('Deposit', primaryjoin='Transfer.sender == Deposit.id')
    
    def __init__(self, senderId, receiverId, value):
        self.sender = senderId
        self.receiver = receiverId
        self.value = value
        
    def get_dict(self):
        data = {'id': self.id,
                'value': self.value,
                'transferDate': self.transferDate,
                'sender': self.sender,
                'receiver': self.receiver      
                }
        return data
        
    
class RepaymentRecord(db.Model):
    __tablename__ = 'repaymentRecords'

    id = Column(Integer, primary_key=True, autoincrement=True)
    amount = Column(Integer, nullable=False)
    paymentDate = Column(TIMESTAMP, nullable=False)
    loanId = Column(ForeignKey('loans.id'), nullable=False, index=True)

    loan = relationship('Loan')
    
    def get_dict(self):
        data = {'id': self.id,
                'amount': self.amount,
                'paymentDate': self.paymentDate,
                'loanId': self.loanId     
                }
        return data


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):

        token = None

        if 'token' in request.headers:
            token = request.headers['token']

        if not token:
            return jsonify({'message': 'Token is missing'}), 400

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(id=data['userId']).first()
        except jwt.ExpiredSignature:
            return jsonify({'message': 'Token has expired'}), 400
        except Exception as e:
            print(e)
            return jsonify({'message': 'token is invalid'}), 400

        return f(current_user, *args, **kwargs)
    return decorator


def mock_fill(db):
    db.drop_all()
    db.create_all()
    
    account = Account()
    account.balance = 1000000
    account.description = "Main account"
    
    user = User("client", "kowalski@wp.pl", "kowalski")
    user2 = User("client", "nowak@wp.pl", "nowak")
    admin = User("admin", "admin@wp.pl", "admin")
    
    dep1 = Deposit(1)
    dep1.balance = 10000
    dep2 = Deposit(2)
    dep2.balance = 10000
    
    loan1 = Loan(dep1.id, 1000, 10, 0.1)
    loan2 = Loan(dep2.id, 500, 5, 0.1)
    
    db.session.add(account)
    db.session.add(user)
    db.session.add(user2)
    db.session.add(admin)
    db.session.add(dep1)
    db.session.add(dep2)
    db.session.add(loan1)
    db.session.add(loan2)
    
    db.session.commit()


def main():
    mock_fill(db)
    

if __name__ == "__main__":
    main()
