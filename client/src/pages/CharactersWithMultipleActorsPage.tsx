import React from "react";
import { useCharactersWithMultipleActors } from "../hooks/useCharactersWithMultipleActors";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const CharactersWithMultipleActorsPage = () => {
    const { characters, loading } = useCharactersWithMultipleActors();

    if (loading) {
        return <Typography align="center" sx={{ mt: 10 }} color="text.secondary">Loading characters...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Characters Played by Multiple Actors
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(characters).map(([character, appearances]) => (
                    <Grid item xs={12} sm={6} md={4} key={character}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom align="center">
                                    {character}
                                </Typography>
                                <List>
                                    {Array.isArray(appearances) ? (
                                        appearances.map(({ actorName, movieName }) => (
                                            <ListItem key={`${actorName}-${movieName}`}>
                                                <ListItemText
                                                    primary={`Played by ${actorName}`}
                                                    secondary={movieName}
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText primary="No data available" />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CharactersWithMultipleActorsPage;