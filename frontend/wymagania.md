
## Wymaganie funkcjonalne 1:

System pozwala na wykonanie przelewu pomiędzy depozytami klientów.

## Wymagania dziedzinowe 1:

System weryfikuje, czy:

* użytkownik ma prawo na wykonanie przelewu (jest właścicielem depozytu-nadawcy, lub pracownikiem banku)
* istnieje depozyt o podanym numerze, który jest odbiorcą przelewu,
* depozyt, z którego wykonywany jest przelew ma środki większe lub równe kwocie przelewu,
* czy zarówno depozyt- nadawca, jak i odbiorca są aktywnymi depozytami

Jeśli warunki są spełnione, należy:
* Zmniejszyć saldo depozytu-nadawcy o zadaną kwotę, a odbiorcy zwiększyć,
* Utworzyć nowy rekord IncomingTransfers powiązany z depozytem-odbiorcą.
* Utworzyć nowy rekord OutgoingTransfers powiązany z depozytem-nadawcą.

## Wymaganie funkcjonalne 2:

System pozwala wykonanie spłatę raty kredytu za pomocą przelewu z depozytu, z którym powiązany jest kredyt.

## Wymagania dziedzinowe 2:

System weryfikuje, czy:
* użytkownik ma prawo na wykonanie przelewu (jest właścicielem depozytu-nadawcy, lub pracownikiem banku),
* istnieje kredyt o podanym numerze, oraz czy jest powiązany z depozytem, z którego wykonywany jest przelew,
* czy zarówno depozyt- nadawca, jak i odbiorca są aktywne,
* czy depozyt-nadawca ma środki pozwalające na wykonanie przelewu, oraz czy saldo+penaltyFee jest mniejsze lub równe kwocie przelewu.
* 
Jeśli warunki są spełnione, należy
* zmniejszyć saldo depozytu-nadawcy oraz kredytu o kwotę przelewu,
* w ramach kwoty przelewu zmniejszać:
  - nextInstallmentPrincipal (maksymalnie do 0), oraz w ramach zmniejszenia nextInstallmentPrincipal:
    * dodać kwotę redukcji do loan.principalPaid
    * odjąć kwotę redukcji od loan.principalUnpaid
    * odjąć kwotę redukcji od loan.balance,
    * odjąć kwotę redukcji z konta księgowego aktywów,
    * dodać kwotę redukcji do konta księgowego pasywów,
  - nextInstallmentInterest, oraz w ramach zmniejszenia nextInstallmentInterest:
    * dodać kwotę redukcji do loan.interestPaid,
    * odjąć kwotę redukcji od loan.balance,
    * dodać kwotę redukcji do konta księgowego przychodów banku,
  - penaltyFee:
    * dodać kwotę redukcji do konta księgowego przychodów banku
  - principalUnpaid:
    * a kwotę redukcji odjąć od loan.balance,
    * kwotę redukcji odjąć z konta księgowego aktywów,
    * dodać kwotę redukcji do konta księgowego pasywów.
* Utworzyć nowy rekord repaymentRecords, który będzie zawierał informację na temat spłaconych elementów.

    Jeśli w wyniku przelewu saldo i penaltyFee spadną do zera, należy zamknąć kredyt.

## Wymaganie funkcjonalne 3:

System codziennie automatycznie nalicza odsetki od kredytu.

## Wymaganie dziedzinowe 3:

Dla każdego aktywnego kredytu należy codziennie:
- dodać do loan.interestUnpaid kwotę loan.principalUnpaid*loan.interestRate/liczba dni bieżącego miesiąca.
- sprawdzić, czy w poprzednim miesiącu została wykonana spłata kredytu- jeśli nie, należy zwiększyć loan.penaltyFee o loan.principalUnpaid*0.1%.
- sprawdzić, czy nie przekroczona została data końca kredytu. Jeśli została przekroczona, należy:
  - zmienić status kredytu na 'lost',
  - wartość (loan.principalPaid + loan.principalUnpaid)*0.03  odjąć od konta księgowego rezerw, i dodać do konta księgowego pasywów.
  - wartość loan.principalUnpaid odjąć od konta księgowego aktywów, i dodać do konta księgowego strat.

## Wymaganie funkcjonalne 4:

System pozwala na utworzenie konta użytkownika przez aplikację internetową.

## Wymagania dziedzinowe 4:

Niezalogowany użytkownik za pomocą formularza rejestracyjnego uzupełnia:

Imię, nazwisko, adres zamieszkania, adres email, login oraz hasło.

W rezultacie w systemie powstaje nowe konto użytkownika.

## Wymaganie funkcjonalne 5:

Zalogowany pracownik banku może założyć depozyt użytkownikowi.

Użytkownik może posiadać tylko jeden depozyt.

## Wymagania dziedzinowe 5:

Pracownik banku podaje kwotę początkową depozytu (wpłacaną przez klienta w okienku).

W ramach wpłaty początkowej zwiększony zostaje stan konta księgowego pasywów, a w tabeli

IncomingTransfers pojawia się zapis rejestrujący początkową wpłatę.

## Wymaganie funkcjonalne 6:

Użytkownik może złożyć wniosek o kredyt.

## Wymagania dziedzinowe 6:

Użytkownik z poziomu strony internetowej podaje wnioskowaną kwotę kredytu oraz okres spłaty.

W wyniku rejestracji kredytu zapisany zostaje nowy rekord Loans o polu status o wartości 'pending'.

Pracownik banku ma dostęp do listy oczekujących kredytów, i może odrzucić, lub zaakceptować wniosek poprzez zmianę pola 'status'
na 'active' lub 'rejected'.

Jeśli kredyt został zaakceptowany, należy:
* kwotę loan.interestUnpaid * 0.03 przenieść z konta księgowego pasywów na konto księgowe rezerw,
* kwotę loan.interestUnpaid przenieść z konta księgowego pasywów na konto księgowe aktywów.
