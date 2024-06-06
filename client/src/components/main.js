import React, { useState } from 'react';
import Navbar from './navbar';

function Main() {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold">PsyMatch</h1>
                <p className="mt-2">Welcome to PsyMatch! This is the main page</p>
            </div>
        </div>
    );
}

export default Main;