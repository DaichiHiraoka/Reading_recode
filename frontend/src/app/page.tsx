'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  notes: string[];
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    if (res.ok) {
      setBooks(await res.json());
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const createBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchBooks();
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <form onSubmit={createBook} className="mb-4">
        <input
          className="border p-2 mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New book title"
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Add
        </button>
      </form>
      <ul className="list-disc pl-5">
        {books.map((b) => (
          <li key={b.id} className="mb-1">
            <Link className="text-blue-600" href={`/book/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
