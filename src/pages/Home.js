// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [visits, setVisits] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [partySize, setPartySize] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('/api/visits');
        setVisits(response.data);
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    };

    fetchVisits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVisit = {
      customerName,
      phoneNumber,
      partySize: Number(partySize),
    };

    try {
      const response = await axios.post('/api/visits', newVisit);
      setVisits([...visits, response.data]);
      // Clear form fields
      setCustomerName('');
      setPhoneNumber('');
      setPartySize('');
    } catch (error) {
      console.error("Error creating new visit:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mt-8 mb-4">Visit Queue</h1>

      {/* Form to add new visit */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <input
            type="number"
            placeholder="Party Size"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Visit
        </button>
      </form>

      <ul className="list-none">
        {visits.map((visit) => (
          <li key={visit.id} className="border-b py-4">
            <Link to={`/visits/${visit.id}`} className="text-blue-500 hover:underline">
              {visit.customerName}
            </Link>
            <div className="text-sm text-gray-600">
              Phone: {visit.phoneNumber}, Party Size: {visit.partySize}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
