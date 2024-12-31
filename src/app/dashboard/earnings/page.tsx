'use client';

import * as React from 'react';
import { Grid, Typography, Card, CardContent, Button, Box, TextField, Divider } from '@mui/material';
import { MonetizationOn as MoneyIcon, AttachMoney as ConvertIcon, Savings as SavingsIcon } from '@mui/icons-material';

export default function RwaConversionPage(): React.JSX.Element {
  const [rwaPoints, setRwaPoints] = React.useState(1500); // Tus puntos actuales
  const [conversionRate, setConversionRate] = React.useState(0.5); // Tasa de conversión (ejemplo: 1 RWA Point = 0.5 $RWA)
  const [pointsToConvert, setPointsToConvert] = React.useState(0);
  const [convertedAmount, setConvertedAmount] = React.useState(0);

  const handleConversion = () => {
    if (pointsToConvert > 0 && pointsToConvert <= rwaPoints) {
      setConvertedAmount(pointsToConvert * conversionRate);
      setRwaPoints((prev) => prev - pointsToConvert); // Resta los puntos convertidos
    } else {
      alert('Please enter a valid amount of points to convert.');
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: 3 }}>
      {/* Título */}
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          RWA Points Conversion
        </Typography>
        <Typography variant="body1" textAlign="center" color="textSecondary">
          Easily convert your RWA Points to $RWA.
        </Typography>
      </Grid>

      {/* Tarjeta de Puntos Actuales */}
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SavingsIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h6">Your RWA Points</Typography>
              <Typography variant="h4" color="primary">{rwaPoints}</Typography>
              <Typography variant="body2" color="textSecondary">
                Earn more points by completing tasks or referring friends!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Tarjeta de Tasa de Conversión */}
      <Grid item xs={12} sm={6}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MoneyIcon fontSize="large" color="success" />
            <Box>
              <Typography variant="h6">Conversion Rate</Typography>
              <Typography variant="h4" color="success">
                1 RWA Point = ${conversionRate} RWA
              </Typography>
              <Typography variant="body2" color="textSecondary">
                The rate may vary over time. Convert now!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Sección de Conversión */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Convert Your RWA Points
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                type="number"
                label="Points to Convert"
                variant="outlined"
                fullWidth
                value={pointsToConvert}
                onChange={(e) => setPointsToConvert(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0, max: rwaPoints } }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<ConvertIcon />}
                onClick={handleConversion}
                disabled={pointsToConvert <= 0 || pointsToConvert > rwaPoints}
              >
                Convert to $RWA
              </Button>
            </Box>
            {convertedAmount > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="success">
                  Conversion Successful!
                </Typography>
                <Typography variant="body1">
                  You received <strong>${convertedAmount.toFixed(2)} RWA</strong>.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
