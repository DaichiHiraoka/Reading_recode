'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  notes: string[];
}

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [book, setBook] = useState<Book | null>(null);
  const [note, setNote] = useState('');

  const fetchBook = async () => {
    const res = await fetch(`/api/books/${id}`);
    if (res.ok) {
      setBook(await res.json());
    }
  };

  useEffect(() => { fetchBook(); }, [id]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    await fetch(`/api/books/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    setNote('');
    fetchBook();
  };

  if (!book) return <div className="p-4">Loading...</div>;

  return (
    <main className="p-4">
      <Link className="text-blue-600" href="/">Back</Link>
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <form onSubmit={addNote} className="mb-4">
        <input
          className="border p-2 mr-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="New note"
        />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Add Note
        </button>
      </form>
      <ul className="list-disc pl-5">
        {book.notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </main>
  );
}
