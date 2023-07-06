import React from 'react';
import { List, ListItem, Typography, Link } from '@mui/material';

class Popular extends React.Component {
    render() {
        return (
            <div style={{ padding: '16px' }}>
                <Typography variant="h5" gutterBottom>Popular</Typography>
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
            </div>
        );
    }
}

export default Popular;
