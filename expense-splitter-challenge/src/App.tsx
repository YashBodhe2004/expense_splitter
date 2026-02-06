import { useState } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import { Expense } from './types';
import { initialPeople, initialExpenses } from './initialData';

function App() {
  // Shared state lifted to the top so all components stay in sync
  const [people, setPeople] = useState<string[]>(initialPeople);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
          💰 Expense Splitter
        </h1>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <PeopleManager
              people={people}
              setPeople={setPeople}
              expenses={expenses}
            />

            <ExpenseForm
              people={people}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2">
            <BalanceView people={people} expenses={expenses} />

            <ExpenseList
              expenses={expenses}
              setExpenses={setExpenses}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
