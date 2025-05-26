import React, { useState } from 'react';

interface TaskFormProps {
    onTaskAdded: (title: string, body: string) => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (title.trim() && body.trim()) {
            onTaskAdded(title, body);
            setTitle('');
            setBody('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col mb-5">
            <input
                type="text"
                placeholder="Título da tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-md mb-2"
            />
            <textarea
                placeholder="Descrição da tarefa"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-md mb-2"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
                Adicionar
            </button>
        </form>
    );
}
