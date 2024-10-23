"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/app/styles/supabaseClient"; // Adjust the import path as needed
import { Session, User } from '@supabase/supabase-js'; // Ensure User type is imported

interface Customer {
  id: number;
  name: string;
  partySize: number;
  mobileNumber: string;
  arrivalTime: Date;
  tableNumber?: number;
  seatedTime?: Date;
  finishedTime?: Date;
  canceledTime?: Date;
}

export default function WaitlistApp() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState<string>("");
  const [partySize, setPartySize] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [seatedCustomers, setSeatedCustomers] = useState<Customer[]>([]);
  const [finishedCustomers, setFinishedCustomers] = useState<Customer[]>([]);
  const [canceledCustomers, setCanceledCustomers] = useState<Customer[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Type assertion to ensure TypeScript recognizes the type
      const session = data.session as Session | null;
      setUser(session?.user || null);
    };
    
    checkSession();
  }, []);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return; // Exit early on error
    }

    if (data && data.user) {
      console.log('User logged in:', data.user);
      setUser(data.user);
    } else {
      console.log('No user data returned');
    }
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setUser(null);
    }
  };

  const addCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && partySize && mobileNumber) {
      if (!mobileNumber.startsWith("+971")) {
        alert("Mobile number must start with UAE area code +971");
        return;
      }
      const newCustomer: Customer = {
        id: Date.now(),
        name,
        partySize: parseInt(partySize),
        mobileNumber,
        arrivalTime: new Date(),
      };
      setCustomers([...customers, newCustomer]);
      setName("");
      setPartySize("");
      setMobileNumber("");
    }
  };

  const removeCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const cancelCustomer = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      const canceledCustomer = { ...customer, canceledTime: new Date() };
      setCanceledCustomers([...canceledCustomers, canceledCustomer]);
      removeCustomer(id);
    }
  };

  const callCustomer = (customer: Customer) => {
    window.location.href = `tel:${customer.mobileNumber}`;
  };

  const calculateWaitTime = (arrivalTime: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - arrivalTime.getTime()) / 60000);
    return `${diffInMinutes} min`;
  };

  const seatCustomer = (id: number, tableNumber: number) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      const seatedCustomer = { ...customer, tableNumber, seatedTime: new Date() };
      setSeatedCustomers([...seatedCustomers, seatedCustomer]);
      removeCustomer(id);
    }
  };

  const finishCustomer = (id: number) => {
    const customer = seatedCustomers.find((c) => c.id === id);
    if (customer) {
      const finishedCustomer = { ...customer, finishedTime: new Date() };
      setFinishedCustomers([...finishedCustomers, finishedCustomer]);
      setSeatedCustomers(seatedCustomers.filter((c) => c.id !== id));
    }
  };

  const downloadReport = () => {
    const csvRows: string[][] = [];
    csvRows.push([
      "Name",
      "Party Size",
      "Mobile Number",
      "Arrival Time",
      "Table Number",
      "Seated Time",
      "Finished Time",
      "Canceled Time",
    ]);

    [...customers, ...seatedCustomers, ...finishedCustomers, ...canceledCustomers].forEach((customer: Customer) => {
      csvRows.push([
        customer.name,
        customer.partySize.toString(),
        customer.mobileNumber,
        customer.arrivalTime.toLocaleString(),
        customer.tableNumber?.toString() || "",
        customer.seatedTime ? customer.seatedTime.toLocaleString() : "",
        customer.finishedTime ? customer.finishedTime.toLocaleString() : "",
        customer.canceledTime ? customer.canceledTime.toLocaleString() : "",
      ]);
    });

    const csvString = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "waitlist_report.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCustomers((prevCustomers) => [...prevCustomers]);
      setSeatedCustomers((prevSeated) => [...prevSeated]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 min-h-screen flex flex-col">
      <header className="bg-white bg-opacity-70 backdrop-blur-md shadow-md py-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Waitlist App</h1>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-gray-800 hover:text-purple-600">Home</a></li>
            <li><a href="#" className="text-gray-800 hover:text-purple-600">Menu</a></li>
            <li><a href="#" className="text-gray-800 hover:text-purple-600">About Us</a></li>
            <li><a href="#" className="text-gray-800 hover:text-purple-600">Contact Us</a></li>
          </ul>
        </nav>
      </header>

      <div className="container mx-auto p-4 max-w-4xl flex-grow bg-white shadow-lg rounded-xl mt-6">
        {user ? (
          <>
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Modern Waitlist App</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add to Waitlist</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addCustomer} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partySize">Party Size</Label>
                    <Input
                      id="partySize"
                      type="number"
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                      placeholder="Enter party size"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number (+971 required)</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+971 50 123 4567"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white">
                    Add to Waitlist
                  </Button>
                </form>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Waiting Customers</h2>
            <div className="space-y-4">
              {customers.map((customer, index) => (
                <Card key={customer.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{customer.name} (Queue {index + 1})</h3>
                      <p>Phone: {customer.mobileNumber}</p>
                      <p>Party of {customer.partySize}</p>
                      <p>Arrival Time: {customer.arrivalTime.toLocaleTimeString()}</p>
                      <p>Waiting Time: {calculateWaitTime(customer.arrivalTime)}</p>
                      {index === 0 && <p className="text-green-500 font-bold">Next to be Seated</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => seatCustomer(customer.id, parseInt(prompt("Enter table number:") || "0"))}>
                        Seat
                      </Button>
                      <Button onClick={() => callCustomer(customer)}>Call</Button>
                      <Button variant="destructive" onClick={() => cancelCustomer(customer.id)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800">Seated Customers</h2>
            <div className="space-y-4">
              {seatedCustomers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                    <p>Phone: {customer.mobileNumber}</p>
                    <p>Table Number: {customer.tableNumber}</p>
                    <p>Seated Time: {customer.seatedTime?.toLocaleTimeString()}</p>
                    <Button variant="destructive" onClick={() => finishCustomer(customer.id)}>
                      Finish
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800">Finished Customers</h2>
            <div className="space-y-4">
              {finishedCustomers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                    <p>Phone: {customer.mobileNumber}</p>
                    <p>Seated Time: {customer.seatedTime?.toLocaleTimeString()}</p>
                    <p>Finished Time: {customer.finishedTime?.toLocaleTimeString()}</p>
                    <p>Time Seated: {customer.finishedTime && customer.seatedTime ? Math.floor((customer.finishedTime.getTime() - customer.seatedTime.getTime()) / 60000) + ' min' : 'N/A'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800">Canceled Customers</h2>
            <div className="space-y-4">
              {canceledCustomers.map((customer) => (
                <Card key={customer.id}>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{customer.name}</h3>
                    <p>Phone: {customer.mobileNumber}</p>
                    <p>Canceled Time: {customer.canceledTime?.toLocaleTimeString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={downloadReport} className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white">
                Download Report
              </Button>
            </div>

            <div className="mt-6">
              <Button onClick={logoutUser} className="w-full bg-red-600 text-white">
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Login to Continue</h1>
            <form onSubmit={loginUser} className="space-y-4 w-full max-w-md">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white">
                Login
              </Button>
            </form>
          </div>
        )}
      </div>

      <footer className="bg-white bg-opacity-70 backdrop-blur-md shadow-md py-4 mt-auto">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Waitlist App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
