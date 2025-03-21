import React from "react";
import { useActorsWithMultipleCharacters } from "../hooks/useActorsWithMultipleCharacters";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";

const ActorsWithMultipleCharactersPage = () => {
    const { actors, loading } = useActorsWithMultipleCharacters();

    if (loading) {
        return (
            <Typography align="center" sx={{ mt: 10 }} color="text.secondary">
                Loading actors with multiple characters...
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Actors with Multiple Characters
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(actors).map(([actor, roles]) => (
                    <Grid item xs={12} sm={6} md={4} key={actor}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {actor}
                                </Typography>
                                <List dense>
                                    {(Array.isArray(roles) ? roles : []).map(({ movieName, characterName }) => (
                                        <React.Fragment key={`${movieName}-${characterName}`}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={characterName}
                                                    secondary={`in ${movieName}`}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ActorsWithMultipleCharactersPage;