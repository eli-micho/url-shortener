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
import { indigo } from '@mui/material/colors';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

function App() {
  const theme = useTheme();

  const [linkInput, setLinkInput] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');
  const [messageAlert, setMessageAlert] = useState<string>('');
  const [links, setLinks] = useState<any[]>([]);

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

  useEffect(() => {
    getRecords();
  }, []);

  const handleLinkCopy = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url);
      setMessageAlert('Copied!');
    }
  };

  const validateInput = () => {
    if (!linkInput) {
      setLinkError('');
      return;
    }

    if (!urlRegex.test(linkInput)) {
      setLinkError('Invalid link');
    } else {
      setLinkError('');
    }
  };

  const onShortenClicked = async () => {
    if (!linkError) {
      try {
        const response = await fetch('http://localhost:5000/link/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalURL: linkInput,
          }),
        }).catch((err) => {
          window.alert(err);
          return;
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setLinkInput('');
        setMessageAlert('Link shortened!');
        getRecords();
      } catch (error) {
        console.log(error, 'error');
        setMessageAlert(error.error);
      }
    }
  };

  const handleBlur = () => {
    validateInput();
  };

  return (
    <div className="App">
      <Box>
        <Box
          sx={{
            marginBottom: theme.spacing(1),
            textAlign: 'center',
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
            marginBottom: theme.spacing(10),
          }}
        >
          <TextField
            error={Boolean(linkError)}
            helperText={linkError}
            variant="outlined"
            value={linkInput}
            onBlur={() => handleBlur()}
            onChange={(e) => setLinkInput(e.target.value)}
            InputProps={{
              placeholder: 'Paste your URL here',
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRoundedIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            size="small"
            sx={{
              marginRight: theme.spacing(2),
            }}
          />
          <Button
            variant="contained"
            onClick={() => onShortenClicked()}
            sx={{
              textTransform: 'capitalize',
            }}
          >
            Shorten
          </Button>
        </Paper>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: theme.spacing(2),
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              width: '100%',
              alignSelf: 'start',
            }}
          >
            Recent Links
          </Typography>

          <List
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {links.length === 0 && (
              <Typography variant="subtitle1">No records found</Typography>
            )}
            {links.map((item, ind) => (
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  padding: theme.spacing(1.5),
                  backgroundColor: indigo[100],
                  width: '100%',
                  ...(ind % 2 !== 0
                    ? {
                        backgroundColor: (theme) => indigo[50],
                        color: (theme) =>
                          theme.palette.getContrastText(
                            theme.palette.background.default
                          ),
                      }
                    : {}),
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
                <Typography variant="body2">{item.shortCode}</Typography>
                <Link href={item.originalURL} variant="caption">
                  {item.originalURL}
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
        open={Boolean(messageAlert)}
        autoHideDuration={5000}
        onClose={() => setMessageAlert('')}
      >
        <Alert
          onClose={() => setMessageAlert('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {messageAlert}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
