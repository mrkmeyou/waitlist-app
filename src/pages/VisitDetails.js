// src/pages/VisitDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VisitDetails = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const response = await axios.get(`/api/visits/${id}`);
        setVisit(response.data);
      } catch (error) {
        console.error("Error fetching visit details:", error);
      }
    };

    fetchVisitDetails();
  }, [id]);

  if (!visit) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mt-4">{visit.customerName}</h2>
      <p className="mt-2">Phone: {visit.phoneNumber}</p>
      <p className="mt-2">Party Size: {visit.partySize}</p>
      <p className="mt-2">Waiting Time: {visit.waitingTime} minutes</p>
    </div>
  );
};

export default VisitDetails;
n