import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

function ExpenseList({ expenses, setExpenses }: ExpenseListProps) {
  const handleDelete = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl mb-4">📝 Expense History</h2>

      {expenses.map(expense => (
        <div key={expense.id} className="flex flex-col sm:flex-row justify-between mb-2">
          <div>
            <strong>{expense.description}</strong>
            <div className="text-sm">
              Paid by {expense.paidBy}
            </div>
          </div>
          <div>
            ₹{expense.amount.toFixed(2)}
            <button onClick={() => handleDelete(expense.id)}> ❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
