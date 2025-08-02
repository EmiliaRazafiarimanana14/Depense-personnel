import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function Total({ depenses }) {
  const total = depenses.reduce((acc, d) => acc + d.montant, 0);

  return (
    <Card
      elevation={3}
      sx={{
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        borderRadius: 3,
        mt: 0,
      }}
    >
      <CardContent>
        <Box textAlign="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#000', mb: 1 }}
          >
            Total des dépenses
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: '#1e88e5' }}
          >
            {total.toLocaleString('de-DE')} Ar
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
