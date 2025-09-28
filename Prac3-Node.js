const express = require('express');
const app = express();

app.use(express.json());

let seats = []; 
const TOTAL_SEATS = 10;

for (let i = 1; i <= TOTAL_SEATS; i++) {
  seats.push({ id: i, status: 'available', lockedBy: null, lockTimer: null });
}

app.get('/seats', (req, res) => {
  const availableSeats = seats.map(s => ({
    id: s.id,
    status: s.status
  }));
  res.json(availableSeats);
});

app.post('/seats/lock', (req, res) => {
  const { seatId, user } = req.body;

  if (!seatId || !user) {
    return res.status(400).json({ message: 'seatId and user are required' });
  }

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ message: 'Seat not found' });

  if (seat.status === 'booked') {
    return res.status(400).json({ message: 'Seat already booked' });
  }

  if (seat.status === 'locked') {
    return res.status(400).json({ message: `Seat is already locked by ${seat.lockedBy}` });
  }

  seat.status = 'locked';
  seat.lockedBy = user;

  seat.lockTimer = setTimeout(() => {
    seat.status = 'available';
    seat.lockedBy = null;
    seat.lockTimer = null;
    console.log(`Lock expired for seat ${seatId}`);
  }, 60000);

  res.json({ message: `Seat ${seatId} locked successfully by ${user}` });
});

app.post('/seats/confirm', (req, res) => {
  const { seatId, user } = req.body;

  if (!seatId || !user) {
    return res.status(400).json({ message: 'seatId and user are required' });
  }

  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ message: 'Seat not found' });

  if (seat.status !== 'locked' || seat.lockedBy !== user) {
    return res.status(400).json({ message: 'Seat is not locked by you or already booked' });
  }

  seat.status = 'booked';
  seat.lockedBy = null;

  clearTimeout(seat.lockTimer);
  seat.lockTimer = null;

  res.json({ message: `Seat ${seatId} successfully booked by ${user}` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
