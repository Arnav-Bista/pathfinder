import { useState } from 'react';
import type { FormEvent } from 'react';
import './App.css'
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';

export default function App() {
  const [places, setPlaces] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setPlaces([...places, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className='px-8 max-w-screen-lg items-center justify-center mx-auto flex flex-col'>
      <h1 className='my-4 text-6xl w-full text-center font-bold'>Pathfinder</h1>

      <Card className='flex flex-col px-4 py-4 flex-grow max-w-screen-md w-full'>
        <form onSubmit={handleSubmit}>
          <Label htmlFor='lookup' className='my-2'>Where are we headed?</Label>
          <div className='flex gap-2'>
            <Input
              id='lookup'
              placeholder='123 Hope Street, St Andrews, UK'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button>Add</Button>
          </div>
        </form>
        <div className='flex flex-col '>
          {places.map((place, index) => (
            <div key={index} className='text-lg text-gray-700'>
              {place}
            </div>
          ))}
        </div>
      </Card>


    </div>
  );
}
