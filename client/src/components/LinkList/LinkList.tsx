import {
  alpha,
  List,
  ListItem,
  lighten,
  useTheme,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import React from 'react';

export type TLink = {
  _id: string;
  originalURL: string;
  shortCode: string;
};

interface LinkListProps {
  links: TLink[];
  setMessageAlert: React.Dispatch<React.SetStateAction<string>>;
}

const listItemBGColor = lighten('#03a9f4', 0.85);
const shortLinkBase = 'shortlink.io/';

const LinkList = (props: LinkListProps) => {
  const { links, setMessageAlert } = props;
  const theme = useTheme();

  const handleLinkCopy = (url: string) => {
    if (url) {
      navigator.clipboard.writeText(url);
      setMessageAlert('Copied!');
    }
  };

  return (
    <>
      {links.length > 0 && (
        <List
          data-testid="linklist"
          sx={{
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
          }}
        >
          {links.map((item, ind) => (
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                padding: theme.spacing(1.5),
                borderRadius: theme.spacing(0.5),
                backgroundColor: alpha(listItemBGColor, 0.5),
                marginBottom: theme.spacing(1),
                transition: 'all .2s ease-in-out',
                maxWidth: '98%',
                ':hover': {
                  transform: 'scale(1.02)',
                },
                ...(ind % 2 !== 0
                  ? {
                      backgroundColor: (theme) => alpha(listItemBGColor, 0.9),
                      color: (theme) =>
                        theme.palette.getContrastText(listItemBGColor),
                    }
                  : {}),
              }}
              key={item._id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="copy"
                  onClick={() =>
                    handleLinkCopy(`http://localhost:5000/${item.shortCode}`)
                  }
                >
                  <ContentCopyRoundedIcon />
                </IconButton>
              }
            >
              <Link
                variant="body1"
                href={`http://localhost:5000/${item.shortCode}`}
                target="_blank"
                fontWeight={600}
                sx={{
                  textDecoration: 'none',
                }}
              >
                {shortLinkBase}
                {item.shortCode}
              </Link>
              <Typography
                variant="caption"
                sx={{
                  width: '90%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',

                  color: theme.palette.action.disabled,
                }}
              >
                {item.originalURL}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default LinkList;
