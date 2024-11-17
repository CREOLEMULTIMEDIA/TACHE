import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#4761C8] text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <Calendar className="w-8 h-8" />
        <div>
          <h1 className="text-2xl font-bold">
            {currentTime.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h1>
          <p className="text-lg">
            {currentTime.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </header>
  );
}