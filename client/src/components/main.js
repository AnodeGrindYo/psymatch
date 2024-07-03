import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

function Main() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">PsyMatch</h1>
                <p className="mt-2">Bienvenue sur PsyMatch !</p>
                <div className="mt-6">
                    <Link to="/matcher" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                        Trouver un Psychologue
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default Main;
