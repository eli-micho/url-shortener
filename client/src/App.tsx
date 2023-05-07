import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Alert,
  Box,
  Button,
  Grow,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import LinkList from './components/LinkList/LinkList';

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
    if (!linkInput) {
      setLinkError('Required');
      return;
    }
    if (!linkError || linkInput) {
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
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
          [theme.breakpoints.down('md')]: {
            padding: `0 ${theme.spacing(1.5)}`,
          },
        }}
      >
        <Box
          sx={{
            marginBottom: theme.spacing(1),
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="span"
            fontWeight={600}
            sx={{
              color: '#03a9f4',
            }}
          >
            Url
          </Typography>
          <Typography variant="h3" component="span">
            &nbsp;Shortener
          </Typography>
          <Typography variant="subtitle1">Shorten links. That's it.</Typography>
        </Box>

        <Paper
          elevation={1}
          sx={{
            alignItems: 'center',
            display: 'flex',
            marginBottom: theme.spacing(5),
            maxWidth: theme.spacing(80),
            minHeight: theme.spacing(13),
            padding: theme.spacing(2),
            width: '100%',
          }}
        >
          <TextField
            error={Boolean(linkError)}
            FormHelperTextProps={{
              sx: {
                position: 'absolute',
                top: '3.2em',
              },
            }}
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
            disabled={Boolean(linkError)}
            variant="contained"
            onClick={() => onShortenClicked()}
            sx={{
              textTransform: 'capitalize',
              height: theme.spacing(5),
            }}
          >
            Shorten
          </Button>
        </Paper>

        <Grow in={links.length > 0}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              maxWidth: theme.spacing(80),
              width: '100%',
              position: 'relative',
            }}
          >
            <LinkList links={links} setMessageAlert={setMessageAlert} />
          </Box>
        </Grow>

        <Box
          component="footer"
          sx={{
            position: 'fixed',
            bottom: '0.5em',
          }}
        >
          <Link
            variant="body2"
            href="https://github.com/eli-micho/url-shortener"
            target="_blank"
          >
            Github
          </Link>
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
