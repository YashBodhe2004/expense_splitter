import { useState } from 'react';
import { Expense } from '../types';

interface PeopleManagerProps {
  people: string[];
  setPeople: React.Dispatch<React.SetStateAction<string[]>>;
  expenses: Expense[];
}

function PeopleManager({ people, setPeople, expenses }: PeopleManagerProps) {
  const [name, setName] = useState('');

  const handleAddPerson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || people.includes(trimmed)) return;

    setPeople([...people, trimmed]);
    setName('');
  };

  const handleRemovePerson = (person: string) => {
    const isUsed = expenses.some(
      exp =>
        exp.paidBy === person ||
        exp.splitBetween.includes(person)
    );

    if (isUsed) {
      alert(
        `${person} is involved in existing expenses and cannot be removed.`
      );
      return;
    }

    setPeople(people.filter(p => p !== person));
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
      <h2 className="text-2xl mb-4">👥 Manage People</h2>

      <form onSubmit={handleAddPerson} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter person's name"
          className="flex-1 px-3 py-2 border rounded"
        />
        <button className="bg-indigo-500 text-white px-4 py-2 rounded w-full sm:w-auto">
          Add Person
        </button>
      </form>

      {people.map(person => (
        <div
          key={person}
          className="flex justify-between items-center py-1"
        >
          <span>{person}</span>
          <button
            onClick={() => handleRemovePerson(person)}
            className="text-red-500"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}

export default PeopleManager;
