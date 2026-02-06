import { Expense, Balance, SimplifiedDebt } from '../types';

interface BalanceViewProps {
  people: string[];
  expenses: Expense[];
}

function BalanceView({ people, expenses }: BalanceViewProps) {
  // 1️⃣ Calculate balances
  const balances: Balance = {};
  people.forEach(p => (balances[p] = 0));

  expenses.forEach(exp => {
    const share = exp.amount / exp.splitBetween.length;
    balances[exp.paidBy] += exp.amount;
    exp.splitBetween.forEach(p => {
      balances[p] -= share;
    });
  });

  // 2️⃣ Total group spending
  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 3️⃣ Debt simplification (minimum transactions)
  const simplifyDebts = (): SimplifiedDebt[] => {
    const creditors: { person: string; amount: number }[] = [];
    const debtors: { person: string; amount: number }[] = [];

    Object.entries(balances).forEach(([person, amount]) => {
      if (amount > 0) creditors.push({ person, amount });
      if (amount < 0) debtors.push({ person, amount: -amount });
    });

    const result: SimplifiedDebt[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const payAmount = Math.min(debtors[i].amount, creditors[j].amount);

      result.push({
        from: debtors[i].person,
        to: creditors[j].person,
        amount: parseFloat(payAmount.toFixed(2)),
      });

      debtors[i].amount -= payAmount;
      creditors[j].amount -= payAmount;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    return result;
  };

  const settlements = simplifyDebts();

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
      <h2 className="text-gray-700 mb-4 text-2xl border-b pb-2">
        💰 Balances
      </h2>

      {/* Total Group Spending */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <span className="mb-2 sm:mb-0">Total Group Spending:</span>
        <strong className="text-xl">₹{totalSpending.toFixed(2)}</strong>
      </div>

      {/* Individual Balances */}
      <h3 className="text-gray-600 mb-3 text-lg">Individual Balances</h3>

      {people.map(person => {
        const value = balances[person];
        const abs = Math.abs(value).toFixed(2);

        const isOwed = value > 0;
        const owes = value < 0;

        return (
          <div
            key={person}
            className={`flex flex-col sm:flex-row justify-between items-center px-4 py-3 mb-2 rounded-md border
              ${isOwed ? 'bg-green-50 border-green-200' : ''}
              ${owes ? 'bg-red-50 border-red-200' : ''}
              ${value === 0 ? 'bg-gray-50 border-gray-200' : ''}
            `}
          >
            <span className="font-medium">{person}</span>
            <span
              className={`font-semibold
                ${isOwed ? 'text-green-700' : ''}
                ${owes ? 'text-red-700' : ''}
                ${value === 0 ? 'text-gray-600' : ''}
              `}
            >
              {isOwed && `is owed +₹${abs}`}
              {owes && `owes -₹${abs}`}
              {value === 0 && 'settled up'}
            </span>
          </div>
        );
      })}

      {/* Suggested Settlements */}
      <div className="mt-6">
        <h3 className="text-gray-600 mb-2 text-lg">
          🧾 Suggested Settlements
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Minimum transactions to settle all debts:
        </p>

        {settlements.length === 0 ? (
          <p className="text-green-700 font-medium">
            ✅ All balances are settled!
          </p>
        ) : (
          settlements.map((s, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 mb-2 bg-gray-50 rounded border"
            >
              <span className="text-sm">
                <strong className="text-red-600">{s.from}</strong>
                {' → '}
                <strong className="text-green-600">{s.to}</strong>
              </span>
              <span className="font-semibold">
                ₹{s.amount.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BalanceView;
