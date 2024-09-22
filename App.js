import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const filterOptions = [
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }
    ];

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            const res = await axios.post('https://bfhl-be-api.onrender.com/bfhl', parsedData);
            setResponseData(res.data);
            setError(null);
        } catch (err) {
            setError('Invalid JSON input or server error');
            setResponseData(null);
        }
    };

    const handleFilterChange = (selectedOptions) => {
        setSelectedFilters(selectedOptions || []);
    };

    const renderFilteredResponse = () => {
        if (!responseData) return null;

        let filteredText = "Filtered Response:\n";

        selectedFilters.forEach(filter => {
            if (filter.value === 'Numbers') {
                filteredText += `Numbers: ${responseData.numbers.join(', ')}\n`;
            }
            if (filter.value === 'Alphabets') {
                filteredText += `Alphabets: ${responseData.alphabets.join(', ')}\n`;
            }
            if (filter.value === 'Highest Lowercase Alphabet') {
                filteredText += `Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet.join(', ')}\n`;
            }
        });

        return <pre>{filteredText}</pre>; 
    };

    return (
        <div style={{ padding: '20px'}}>
            <h1>API Input & Response</h1>

            <textarea
                rows="5"
                cols="50"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Enter JSON here, e.g., {"data": ["A", "B", "1", "2"]}'
                style={{ marginBottom: '10px' }}
            />
            <br />

            <button onClick={handleSubmit} style={{ marginBottom: '10px' }}>
                Submit
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {responseData && (
                <>
                <br />
                    <label htmlFor="filters">Multi Filter:</label>
                    <Select
                        isMulti
                        name="filters"
                        options={filterOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleFilterChange}
                        placeholder="Select filters..."
                        style={{ marginBottom: '20px', width: '300px' }}
                    />
                    
                    {renderFilteredResponse()}
                </>
            )}
        </div>
    );
}

export default App;
