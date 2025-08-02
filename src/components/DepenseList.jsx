import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function DepenseList({ depenses, onDelete, onEdit }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Grid container spacing={8}>
      {depenses.map((dep) => (
        <Grid item xs={4} key={dep.id}>
          <Card
            sx={{
              width: '100%',
              borderRadius: 3,
              boxShadow: 3,
              background: 'linear-gradient(to bottom right, #f1f8e9, #e8f5e9)',
            }}
          >
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: red[500] }}>{dep.nom?.charAt(0).toUpperCase()}</Avatar>}
              title={dep.nom}
              subheader={`Date : ${dep.date}`}
            />

            <CardContent>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: '#1b5e20' }}>
                <MonetizationOnIcon sx={{ mr: 1, color: '#43a047' }} />
                {Number(dep.montant).toLocaleString()} AR
              </Typography>
            </CardContent>

            <CardActions disableSpacing>
              <IconButton onClick={() => onEdit(dep)} color="primary" aria-label="modifier">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(dep.id)} color="error" aria-label="supprimer">
                <DeleteIcon />
              </IconButton>
              <ExpandMore
                expand={expandedId === dep.id}
                onClick={() => handleExpandClick(dep.id)}
                aria-expanded={expandedId === dep.id}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>

            <Collapse in={expandedId === dep.id} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph sx={{ color: '#4e342e' }}>
                  {dep.details || 'Aucun détail fourni.'}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
