import React from 'react';
import { List, ListItem, Typography, Link, Container } from '@mui/material';

class Latest extends React.Component {
    render() {
        return (
            <Container style={{ padding: '16px' }}>
                <Typography variant="h5" gutterBottom>Latest</Typography>
                <List>
                    <ListItem>
                        <Typography variant="body1">
                            Blog post #1 <Link href="#">go to page</Link>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1">
                            Blog post #2 <Link href="#">go to page</Link>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1">
                            Blog post #3 <Link href="#">go to page</Link>
                        </Typography>
                    </ListItem>
                </List>
            </Container>
        );
    }
}

export default Latest;

