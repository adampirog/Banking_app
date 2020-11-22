# clients

## GET
* Lista wszystkich userów i ich powiązań (id kredytów i depozytów? Lub całe obiekty).

Dostęp: tylko użytkownik typu 'Pracownik'. Dla pozostałych error code 401 unauthorized.

# clients/:id

## GET
* User o zadanym id i jego powiązania.

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

## POST
* JSON z nowymi polami dla danego usera.

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

## DELETE
* 'Usuwa' (poprzez zmianę flagi na nieaktywny) klienta (nie może mieć otwartych rachunków).

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

## GET
* Lista transakcji użytkownika.

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

# clients/:id/transactions/:id_transakcji
## GET
* Szczegóły transakcji użytkownika.

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

# clients/:id/loans
## GET
* Szczegóły kredytu.

Dostęp: użytkownik typu 'Pracownik' i klient o podanym id.

