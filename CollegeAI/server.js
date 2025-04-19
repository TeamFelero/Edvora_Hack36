import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const data = JSON.parse(fs.readFileSync('./College_data.json', 'utf8'));

const scoreCollege = (college, preferences) => {
  const placement = parseFloat(college.Placement || 0);
  const infra = parseFloat(college.Infrastructure || 0);
  const faculty = parseFloat(college.Faculty || 0);
  const academic = parseFloat(college.Academic || 0);

  return (
    placement * preferences.placement +
    infra * preferences.infrastructure +
    faculty * preferences.faculty +
    academic * preferences.academic
  );
};

app.post('/api/recommend', (req, res) => {
  const { stream, state, maxFee, preferences } = req.body;

  const filtered = data
    .filter(c =>
      (!stream || c.Stream === stream) &&
      (!state || c.State.toLowerCase().includes(state.toLowerCase())) &&
      (parseInt((c.UG_fee || '0').replace(/,/g, '')) <= (parseInt(maxFee) || Infinity))
    )
    .map(c => ({ ...c, score: scoreCollege(c, preferences) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json(filtered);
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
