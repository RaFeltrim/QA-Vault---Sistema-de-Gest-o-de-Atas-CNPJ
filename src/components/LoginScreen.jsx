import React, { useState } from 'react';
import { Book } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'OLAMUNDOQACNPJ098') {
            onLogin();
        } else {
            setError('Senha de acesso incorreta.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-600 p-3 rounded-full">
                        <Book className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">QA Vault Access</h1>
                <p className="text-center text-slate-500 mb-6">Repositório Oficial - Projeto CNPJ</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Entrar no Vault
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
