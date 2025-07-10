export interface Flight {
  id: number;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  status: 'Scheduled' | 'On Time' | 'Delayed' | 'Cancelled' | 'Completed';
  plane_id: number;
  departure_airport_id: string;
  arrival_airport_id: string;
  departure_airport?: Airport;
  arrival_airport?: Airport;
  plane?: Plane;
}

export interface Airport {
  id: string;
  name: string;
  city: string;
}

export interface Plane {
  id: number;
  code: string;
  total_seats: number;
}

// Mock airport data
export const airports: Airport[] = [
  {
    id: "SGN",
    name: "Tan Son Nhat International Airport",
    city: "Ho Chi Minh City"
  },
  {
    id: "HAN",
    name: "Noi Bai International Airport", 
    city: "Hanoi"
  },
  {
    id: "DAD",
    name: "Da Nang International Airport",
    city: "Da Nang"
  },
  {
    id: "CXR",
    name: "Cam Ranh International Airport",
    city: "Nha Trang"
  },
  {
    id: "PQC",
    name: "Phu Quoc International Airport",
    city: "Phu Quoc"
  },
  {
    id: "HUI",
    name: "Phu Bai International Airport",
    city: "Hue"
  },
  {
    id: "DLI",
    name: "Lien Khuong Airport",
    city: "Da Lat"
  },
  {
    id: "VCS",
    name: "Con Dao Airport",
    city: "Con Dao"
  }
];

// Mock plane data
export const planes: Plane[] = [
  {
    id: 1,
    code: "VN-A321",
    total_seats: 200
  },
  {
    id: 2,
    code: "VN-A350",
    total_seats: 300
  },
  {
    id: 3,
    code: "VN-B787",
    total_seats: 250
  },
  {
    id: 4,
    code: "VN-A320",
    total_seats: 180
  },
  {
    id: 5,
    code: "VN-B777",
    total_seats: 350
  }
];

// Mock flight data
export const flights: Flight[] = [
  {
    id: 1,
    flight_number: "VN101",
    departure_time: "2024-01-15T08:00:00Z",
    arrival_time: "2024-01-15T09:30:00Z",
    base_price: 1200000,
    status: "On Time",
    plane_id: 1,
    departure_airport_id: "SGN",
    arrival_airport_id: "HAN",
    departure_airport: airports[0],
    arrival_airport: airports[1],
    plane: planes[0]
  },
  {
    id: 2,
    flight_number: "VN102",
    departure_time: "2024-01-15T10:00:00Z",
    arrival_time: "2024-01-15T11:30:00Z",
    base_price: 1200000,
    status: "Scheduled",
    plane_id: 1,
    departure_airport_id: "HAN",
    arrival_airport_id: "SGN",
    departure_airport: airports[1],
    arrival_airport: airports[0],
    plane: planes[0]
  },
  {
    id: 3,
    flight_number: "VN201",
    departure_time: "2024-01-15T07:30:00Z",
    arrival_time: "2024-01-15T08:45:00Z",
    base_price: 800000,
    status: "On Time",
    plane_id: 2,
    departure_airport_id: "SGN",
    arrival_airport_id: "DAD",
    departure_airport: airports[0],
    arrival_airport: airports[2],
    plane: planes[1]
  },
  {
    id: 4,
    flight_number: "VN202",
    departure_time: "2024-01-15T09:30:00Z",
    arrival_time: "2024-01-15T10:45:00Z",
    base_price: 800000,
    status: "Delayed",
    plane_id: 2,
    departure_airport_id: "DAD",
    arrival_airport_id: "SGN",
    departure_airport: airports[2],
    arrival_airport: airports[0],
    plane: planes[1]
  },
  {
    id: 5,
    flight_number: "VN301",
    departure_time: "2024-01-15T06:00:00Z",
    arrival_time: "2024-01-15T07:00:00Z",
    base_price: 600000,
    status: "Completed",
    plane_id: 3,
    departure_airport_id: "SGN",
    arrival_airport_id: "CXR",
    departure_airport: airports[0],
    arrival_airport: airports[3],
    plane: planes[2]
  },
  {
    id: 6,
    flight_number: "VN302",
    departure_time: "2024-01-15T08:00:00Z",
    arrival_time: "2024-01-15T09:00:00Z",
    base_price: 600000,
    status: "Scheduled",
    plane_id: 3,
    departure_airport_id: "CXR",
    arrival_airport_id: "SGN",
    departure_airport: airports[3],
    arrival_airport: airports[0],
    plane: planes[2]
  },
  {
    id: 7,
    flight_number: "VN401",
    departure_time: "2024-01-15T11:00:00Z",
    arrival_time: "2024-01-15T12:15:00Z",
    base_price: 900000,
    status: "Scheduled",
    plane_id: 4,
    departure_airport_id: "SGN",
    arrival_airport_id: "PQC",
    departure_airport: airports[0],
    arrival_airport: airports[4],
    plane: planes[3]
  },
  {
    id: 8,
    flight_number: "VN402",
    departure_time: "2024-01-15T13:15:00Z",
    arrival_time: "2024-01-15T14:30:00Z",
    base_price: 900000,
    status: "Scheduled",
    plane_id: 4,
    departure_airport_id: "PQC",
    arrival_airport_id: "SGN",
    departure_airport: airports[4],
    arrival_airport: airports[0],
    plane: planes[3]
  },
  {
    id: 9,
    flight_number: "VN501",
    departure_time: "2024-01-15T14:00:00Z",
    arrival_time: "2024-01-15T15:30:00Z",
    base_price: 1100000,
    status: "Scheduled",
    plane_id: 5,
    departure_airport_id: "HAN",
    arrival_airport_id: "DAD",
    departure_airport: airports[1],
    arrival_airport: airports[2],
    plane: planes[4]
  },
  {
    id: 10,
    flight_number: "VN502",
    departure_time: "2024-01-15T16:30:00Z",
    arrival_time: "2024-01-15T18:00:00Z",
    base_price: 1100000,
    status: "Scheduled",
    plane_id: 5,
    departure_airport_id: "DAD",
    arrival_airport_id: "HAN",
    departure_airport: airports[2],
    arrival_airport: airports[1],
    plane: planes[4]
  },
  {
    id: 11,
    flight_number: "VN601",
    departure_time: "2024-01-15T09:00:00Z",
    arrival_time: "2024-01-15T10:15:00Z",
    base_price: 700000,
    status: "Scheduled",
    plane_id: 1,
    departure_airport_id: "HAN",
    arrival_airport_id: "CXR",
    departure_airport: airports[1],
    arrival_airport: airports[3],
    plane: planes[0]
  },
  {
    id: 12,
    flight_number: "VN602",
    departure_time: "2024-01-15T11:15:00Z",
    arrival_time: "2024-01-15T12:30:00Z",
    base_price: 700000,
    status: "Scheduled",
    plane_id: 1,
    departure_airport_id: "CXR",
    arrival_airport_id: "HAN",
    departure_airport: airports[3],
    arrival_airport: airports[1],
    plane: planes[0]
  },
  {
    id: 13,
    flight_number: "VN701",
    departure_time: "2024-01-15T12:00:00Z",
    arrival_time: "2024-01-15T13:30:00Z",
    base_price: 1000000,
    status: "Scheduled",
    plane_id: 2,
    departure_airport_id: "HAN",
    arrival_airport_id: "PQC",
    departure_airport: airports[1],
    arrival_airport: airports[4],
    plane: planes[1]
  },
  {
    id: 14,
    flight_number: "VN702",
    departure_time: "2024-01-15T14:30:00Z",
    arrival_time: "2024-01-15T16:00:00Z",
    base_price: 1000000,
    status: "Scheduled",
    plane_id: 2,
    departure_airport_id: "PQC",
    arrival_airport_id: "HAN",
    departure_airport: airports[4],
    arrival_airport: airports[1],
    plane: planes[1]
  },
  {
    id: 15,
    flight_number: "VN801",
    departure_time: "2024-01-15T15:00:00Z",
    arrival_time: "2024-01-15T16:15:00Z",
    base_price: 850000,
    status: "Scheduled",
    plane_id: 3,
    departure_airport_id: "DAD",
    arrival_airport_id: "CXR",
    departure_airport: airports[2],
    arrival_airport: airports[3],
    plane: planes[2]
  },
  {
    id: 16,
    flight_number: "VN802",
    departure_time: "2024-01-15T17:15:00Z",
    arrival_time: "2024-01-15T18:30:00Z",
    base_price: 850000,
    status: "Scheduled",
    plane_id: 3,
    departure_airport_id: "CXR",
    arrival_airport_id: "DAD",
    departure_airport: airports[3],
    arrival_airport: airports[2],
    plane: planes[2]
  },
  {
    id: 17,
    flight_number: "VN901",
    departure_time: "2024-01-15T18:00:00Z",
    arrival_time: "2024-01-15T19:15:00Z",
    base_price: 950000,
    status: "Scheduled",
    plane_id: 4,
    departure_airport_id: "DAD",
    arrival_airport_id: "PQC",
    departure_airport: airports[2],
    arrival_airport: airports[4],
    plane: planes[3]
  },
  {
    id: 18,
    flight_number: "VN902",
    departure_time: "2024-01-15T20:15:00Z",
    arrival_time: "2024-01-15T21:30:00Z",
    base_price: 950000,
    status: "Scheduled",
    plane_id: 4,
    departure_airport_id: "PQC",
    arrival_airport_id: "DAD",
    departure_airport: airports[4],
    arrival_airport: airports[2],
    plane: planes[3]
  },
  {
    id: 19,
    flight_number: "VN1001",
    departure_time: "2024-01-15T21:00:00Z",
    arrival_time: "2024-01-15T22:15:00Z",
    base_price: 750000,
    status: "Scheduled",
    plane_id: 5,
    departure_airport_id: "CXR",
    arrival_airport_id: "PQC",
    departure_airport: airports[3],
    arrival_airport: airports[4],
    plane: planes[4]
  },
  {
    id: 20,
    flight_number: "VN1002",
    departure_time: "2024-01-15T23:15:00Z",
    arrival_time: "2024-01-16T00:30:00Z",
    base_price: 750000,
    status: "Scheduled",
    plane_id: 5,
    departure_airport_id: "PQC",
    arrival_airport_id: "CXR",
    departure_airport: airports[4],
    arrival_airport: airports[3],
    plane: planes[4]
  }
];

// Type for FlightsListPage
export interface FlightsListPageFlight {
  id: string;
  flightNumber: string;
  departureAirport: { id: string; name: string; city: string };
  arrivalAirport: { id: string; name: string; city: string };
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  basePrice: number;
}

// Transform flights to fit FlightsListPage interface
export const flightsForListPage: FlightsListPageFlight[] = flights.map(f => ({
  id: String(f.id),
  flightNumber: f.flight_number,
  departureAirport: f.departure_airport
    ? { ...f.departure_airport }
    : { id: f.departure_airport_id, name: '', city: '' },
  arrivalAirport: f.arrival_airport
    ? { ...f.arrival_airport }
    : { id: f.arrival_airport_id, name: '', city: '' },
  departureTime: f.departure_time,
  arrivalTime: f.arrival_time,
  availableSeats: f.plane?.total_seats
    ? Math.floor(f.plane.total_seats * 0.7 + Math.random() * f.plane.total_seats * 0.3)
    : Math.floor(100 + Math.random() * 100),
  basePrice: f.base_price,
}));

// Helper function to get flight by ID
export const getFlightById = (id: number): Flight | undefined => {
  return flights.find(flight => flight.id === id);
};

// Helper function to get flights by departure airport
export const getFlightsByDepartureAirport = (airportId: string): Flight[] => {
  return flights.filter(flight => flight.departure_airport_id === airportId);
};

// Helper function to get flights by arrival airport
export const getFlightsByArrivalAirport = (airportId: string): Flight[] => {
  return flights.filter(flight => flight.arrival_airport_id === airportId);
};

// Helper function to search flights by route
export const searchFlights = (from: string, to: string, date?: string): Flight[] => {
  return flights.filter(flight => 
    flight.departure_airport_id === from && 
    flight.arrival_airport_id === to
  );
};

// Helper function to get airport by ID
export const getAirportById = (id: string): Airport | undefined => {
  return airports.find(airport => airport.id === id);
};

// Helper function to get plane by ID
export const getPlaneById = (id: number): Plane | undefined => {
  return planes.find(plane => plane.id === id);
};
