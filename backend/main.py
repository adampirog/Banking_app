from flask import request, jsonify
from database_interface import db, app, token_required
from database_interface import User, Deposit, Transfer, Loan, RepaymentRecord, Account
import jwt
from datetime import datetime, timedelta
from sqlalchemy import and_


@app.route('/user/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        new_user = User('client', data['email'], data['password'])
        new_user.firstName = data['firstName']
        new_user.lastName = data['lastName']
        new_user.phone = data['phone']
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'Sucess'}), 200
    except Exception:
        db.session.rollback()
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/user/login', methods=['POST'])
def login_user():
    data = request.get_json()
    
    try:
        user = User.query.filter_by(email=data['email']).first()
        
        if(user.verify(data['password'])):
            token = jwt.encode({'userId': user.id, 'exp': datetime.utcnow() + timedelta(minutes=30)}, app.config['SECRET_KEY'])
            return jsonify({'clientId': user.id, 'role': user.userType, 'token': token.decode('UTF-8')}), 200
        
        return jsonify({'message': 'invalid password'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400


@app.route('/user', methods=['GET'])
@token_required
def get_user(caller):
    try:
        return jsonify(caller.get_dict()), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400


@app.route('/users', methods=['GET'])
@token_required
def get_all_users(caller):
    if caller.userType != 'admin':
        return jsonify({'message': 'Unauthorized call'}), 400
    try:
        users = User.query.all()
        result = []
        for user in users:
            result.append(user.get_dict())
        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
@app.route('/accounts', methods=['GET'])
@token_required
def get_accounts(caller):
    if caller.userType != 'admin':
        return jsonify({'message': 'Unauthorized call'}), 400
    try:
        users = Account.query.all()
        result = []
        for user in users:
            result.append(user.get_dict())
        return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400


@app.route('/user', methods=['PATCH'])
@token_required
def edit_user(caller):
    
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.userType != 'admin') and (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        data = request.get_json()
        user = User.query.filter_by(id=userId).first()
        
        if('password' in data):
            user.set_password(data['password'])
        if('firstName' in data):
            user.firstName = data['firstName']
        if('lastName' in data):
            user.lastName = data['lastName']  
        if('phone' in data):
            user.phone = data['phone']
        if('email' in data):
            user.email = data['email']
            
        db.session.commit()    
        return jsonify({'message': 'Success'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/deposit', methods=['GET'])
@token_required
def get_deposit(caller):
    
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.userType != 'admin') and (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        deposit = db.session.query(Deposit).join(User).filter(User.id == userId).first()
               
        return jsonify(deposit.get_dict()), 200      
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/deposit', methods=['POST'])
@token_required
def create_deposit(caller):
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.userType != 'admin'):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        deposit = db.session.query(Deposit).join(User).filter(User.id == userId).first()
        if(deposit is not None):
            return jsonify({'message': 'Client alreade has a deposit', 'id': deposit.id}), 400
        
        deposit = Deposit(userId)
        db.session.add(deposit)
        db.session.commit()
               
        return jsonify({'message': 'Success'}), 200    
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/transfer', methods=['POST'])
@token_required
def transfer(caller):
    try:
        data = request.get_json()
        amount = int(data['amount'])
        sender_deposit = Deposit.query.filter_by(id=data['sender']).first()
        receiver_deposit = Deposit.query.filter_by(id=data['receiver']).first()
        
        if(sender_deposit is None or receiver_deposit is None):
            return jsonify({'message': 'Unknown account number'}), 400
    
        if (caller.id != sender_deposit.userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        if(sender_deposit.balance < amount):
            return jsonify({'message': 'Insufficient funds'}), 400
        
        sender_deposit.balance -= amount
        receiver_deposit.balance += amount
        
        record = Transfer(sender_deposit.id, receiver_deposit.id, amount)
        if('description' in data):
            record.description = data['description']
        
        db.session.add(record)
        db.session.commit()
               
        return jsonify({'message': 'Success'}), 200    
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    

@app.route('/client/deposit/incoming', methods=['GET'])
@token_required
def get_incoming_transfers(caller):
    
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.userType != 'admin') and (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        transfers = db.session.query(Transfer).join(Deposit, and_(Transfer.receiver == Deposit.id)).join(User).filter(User.id == userId)
        
        result = []
        for transfer in transfers:
            result.append(transfer.get_dict())
               
        return jsonify(result), 200      
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/deposit/outgoing', methods=['GET'])
@token_required
def get_outgoing_transfers(caller):
    
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        transfers = db.session.query(Transfer).join(Deposit, and_(Transfer.sender == Deposit.id)).join(User).filter(User.id == userId)
        
        result = []
        for transfer in transfers:
            result.append(transfer.get_dict())
               
        return jsonify(result), 200      
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/loans', methods=['GET'])
@token_required
def get_loans(caller):
    
    try:
        userId = request.args.get('clientId', type=int)
    
        if (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        loans = db.session.query(Loan).join(Deposit).join(User).filter(User.id == userId).all()
        
        result = []
        for loan in loans:
            result.append(loan.get_dict())
               
        return jsonify(result), 200      
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/loans', methods=['POST'])
@token_required
def create_loan(caller):
    try:
        userId = request.args.get('clientId', type=int)
        data = request.get_json()
    
        if (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        deposit = db.session.query(Deposit).join(User).filter(User.id == userId).first()
        if(deposit is None):
            return jsonify({'message': 'Client has no deposit'}), 400
        
        interestRate = float(data['interestRate'])
        if(interestRate < 0 or interestRate > 1):
            return jsonify({'message': 'Invalid interest rate'}), 400
            
        loan = Loan(deposit.id, data['value'], data['installments'], interestRate)
        loan.purpose = data['purpose']
        
        db.session.add(loan)
        db.session.commit()
               
        return jsonify({'message': 'Success'}), 200    
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'An error occured'}), 400


@app.route('/loans', methods=['GET'])
@token_required
def filter_loans(caller):
    try:
        data = request.get_json()
    
        if (caller.userType != 'admin'):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        result = []
        
        if('status' and 'iban' in data):
            loans = db.session.query(Loan).join(Deposit).filter(Deposit.id == data['iban'] and Loan.status == data['status']).all()
        elif('status' in data):
            loans = db.session.query(Loan).filter(Loan.status == data['status']).all()
        elif('iban' in data):
            loans = db.session.query(Loan).join(Deposit).filter(Deposit.id == data['iban']).all()
        
        for loan in loans:
            result.append(loan.get_dict())
               
        return jsonify(result), 200    
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/loans', methods=['PATCH'])
@token_required
def change_loan_status(caller):
    try:
        data = request.get_json()
    
        if (caller.userType != 'admin'):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        loan = db.session.query(Loan).filter(Loan.id == data['iban']).first()
        
        #loan accepted
        if(data['status'] == 'open' and loan.status == "pending"):
            loan.acceptanceDate = datetime.now()
            deposit = Deposit.query.filter_by(id=loan.depositId).first()
            deposit.balance += loan.value
            
            liability = Account.query.filter_by(description="liability").first()
            asset = Account.query.filter_by(description="asset").first()
            
            liability.balance -= loan.value
            asset.balance += loan.value

        loan.status = data['status']
        db.session.commit()
               
        return jsonify({'message': 'Success'}), 200    
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'message': 'An error occured'}), 400


@app.route('/loans/records', methods=['GET'])
@token_required
def get_repayment_records(caller):
    try:
        loanId = request.args.get('loanId', type=int)
        
        if (caller.userType != 'admin'):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        records = RepaymentRecord.query.filter_by(loanId=loanId).all()
        result = []
        for item in records:
            result.append(item.get_dict())
               
        return jsonify(result), 200    
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
@app.route('/client/loans/records', methods=['GET'])
@token_required
def get_client_repayment_records(caller):
    try:
        userId = request.args.get('clientId', type=int)
        
        if (caller.userType != 'admin') and (caller.id != userId):
            return jsonify({'message': 'Unauthorized call'}), 400
        
        records = db.session.query(RepaymentRecord).join(Loan).join(Deposit).join(User).filter(User.id == userId).all()
        result = []
        for item in records:
            result.append(item.get_dict())
               
        return jsonify(result), 200    
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occured'}), 400
    
    
def main():
    db.create_all()
    app.run(debug=True)
    
    
if __name__ == "__main__":
    main()
    