import { useState } from 'react';
import type { FormEvent } from 'react';
import './App.css'
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { BACKEND_URL } from './main';
// {
//   "name": "3 Belvedere Pl, London SE1 0AD, UK",
//   "location": {
//     "lat": 51.4995697,
//     "lng": -0.1008432
//   },
//   "viewport": {
//     "northeast": {
//       "lat": 51.50075193029149,
//       "lng": -0.09937006970849796
//     },
//     "southwest": {
//       "lat": 51.4980539697085,
//       "lng": -0.102068030291502
//     }
//   }
// }

interface Coordinates {
  lat: number;
  lng: number;
}

interface ViewPort {
  northeast: Coordinates;
  southwest: Coordinates
}

interface Address {
  name: string;
  location: Coordinates,
  viewport: ViewPort
}

export default function App() {
  const [places, setPlaces] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setErrors] = useState<string>('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }
    setLoading(true);
    try {
      setErrors("");
      const response = await fetch(`${BACKEND_URL}/geocode?address=${encodeURI(inputValue)}`);
      const data: Address = await response.json();
      setPlaces([...places, data]);
      setInputValue("");
    }
    catch (e) {
      console.log(e);
      setErrors(e.toString())
    }
    finally {
      setLoading(false);
    }
  }

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
            <Button disabled={loading} type="submit" >Add</Button>
          </div>
          {
            error &&
            <div className='mx-4 text-sm'>We've got problems: {error}</div>
          }
        </form>
        <div className='flex flex-col '>
          {places.map((place, index) => (
            <div className='flex justify-between'>
              <div>
              <h3 key={index} >
                {place.name}
              </h3>
              <p className='mx-4 text-gray-600 text-sm'>{place.location.lat}, {place.location.lng}</p>
              </div>
              <Button
                onClick={() => {
                  // TODO
                }}
              >X</Button>
            </div>
          ))}
        </div>
      </Card>


    </div>
  );
}
