import { Box, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { date: 'Nov 1', amount: 1200 },
  { date: 'Nov 2', amount: 980 },
  { date: 'Nov 3', amount: 1450 },
  { date: 'Nov 4', amount: 1700 },
  { date: 'Nov 5', amount: 1900 },
];

const transactions = [
  { id: 1, customer: 'Alice Johnson', amount: '$120.00', status: 'Paid', date: 'Nov 5' },
  { id: 2, customer: 'Bob Smith', amount: '$250.00', status: 'Pending', date: 'Nov 5' },
  { id: 3, customer: 'Charlie Brown', amount: '$99.99', status: 'Failed', date: 'Nov 4' },
];

export default function App() {
  return (
    <Box sx={{ p: 4, bgcolor: '#f7f9fb', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Payment Dashboard</Typography>

      {/* Overview Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h5" color="primary">$12,450</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Payments This Month</Typography>
            <Typography variant="h5" color="primary">153</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Pending Transactions</Typography>
            <Typography variant="h5" color="primary">8</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ mt: 4, height: 300 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Revenue Over Time</Typography>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Transactions Table */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.customer}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
