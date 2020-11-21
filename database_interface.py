from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Date, ForeignKey, Integer, String, TIMESTAMP
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
            
        while(Deposit.query.filter_by(id=tmp_iban).first() is not None):
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
    purpose = Column(String(150), nullable=False)
    totalValue = Column(Integer, nullable=False)
    nextInstallmentValue = Column(Integer, nullable=False)
    nextInstallmentDate = Column(Date, nullable=False)
    interestPaid = Column(Integer, nullable=False)
    penaltyFee = Column(Integer, nullable=False)
    principalPaid = Column(Integer, nullable=False)
    principalUnpaid = Column(Integer, nullable=False)
    depositId = Column(ForeignKey('deposits.id'), nullable=False, index=True)

    deposit = relationship('Deposit')


class Transfer(db.Model):
    __tablename__ = 'transfers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(Integer, nullable=False)
    transferDate = Column(TIMESTAMP, nullable=False, default=datetime.now)
    sender = Column(ForeignKey('deposits.id'), nullable=False, index=True)
    receiver = Column(ForeignKey('deposits.id'), nullable=False, index=True)

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

    id = Column(Integer, primary_key=True, autoincrement=True, default=datetime.now)
    principal = Column(Integer, nullable=False)
    interest = Column(Integer, nullable=False)
    value = Column(Integer, nullable=False)
    description = Column(String(150))
    loanId = Column(ForeignKey('loans.id'), nullable=False, index=True)

    loan = relationship('Loan')


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
    dep1.balance = 1000
    dep2 = Deposit(2)
    dep2.balance = 2000
    
    db.session.add(account)
    db.session.add(user)
    db.session.add(user2)
    db.session.add(admin)
    db.session.add(dep1)
    db.session.add(dep2)
    
    db.session.commit()


def main():
    mock_fill(db)
    

if __name__ == "__main__":
    main()
