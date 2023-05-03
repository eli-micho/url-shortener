import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const data = [
  {
    id: 1,
    shortURL: 'https://shortify.ai/12346',
  },
];

function App() {
  const theme = useTheme();

  const [linkInput, setLinkInput] = useState<string>('');
  const [copiedAlert, setCopiedAlert] = useState<boolean>(false);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    const getRecords = async () => {
      try {
        const response = await fetch(`http://localhost:5000/link`);
        if (!response.ok) {
          throw new Error('Bad response from server');
        }
        const returnedLinks = await response.json();
        setLinks(returnedLinks);
      } catch (error) {
        console.error(error);
      }
    };
    getRecords();
  }, []);

  const handleLinkCopy = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopiedAlert(true);
    }
  };

  const onShortenClicked = async () => {
    /*  await fetch("http://localhost:5000/link/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        originalURL: linkInput,
        shortcode: 
      })
    }) */
  };

  return (
    <div className="App">
      <Box>
        <Box
          sx={{
            marginBottom: theme.spacing(1),
          }}
        >
          <Typography variant="h3">Shortify</Typography>
          <Typography variant="subtitle1">Shorten links. That's it.</Typography>
        </Box>
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            padding: theme.spacing(2),
          }}
        >
          <TextField
            variant="outlined"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            InputProps={{
              placeholder: 'Paste your URL here',
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={() => onShortenClicked()}>
            Shorten
          </Button>
        </Paper>

        <Box>
          <Typography variant="subtitle1">History</Typography>
          <List>
            {links.map((item) => (
              <ListItem
                sx={{
                  padding: theme.spacing(1.5),
                  backgroundColor: 'red',
                  width: '100%',
                  borderRadius: theme.spacing(1),
                }}
                key={item._id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="copy"
                    onClick={() => handleLinkCopy(item.shortCode)}
                  >
                    <ContentCopyRoundedIcon />
                  </IconButton>
                }
              >
                <Link href={item.originalURL} variant="body2">
                  {item.shortCode}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={copiedAlert}
        autoHideDuration={5000}
        onClose={() => setCopiedAlert(false)}
      >
        <Alert
          onClose={() => setCopiedAlert(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
