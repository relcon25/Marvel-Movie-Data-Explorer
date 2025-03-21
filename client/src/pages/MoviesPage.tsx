import React from "react";
import { useParams } from "react-router-dom";
import { useMoviesPerActor } from "../hooks/useMoviesPerActor";
import {
    Container,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const MoviesPage = () => {
    const { actor } = useParams<{ actor: string }>();
    const { movies = {}, loading } = useMoviesPerActor(actor || "");

    if (loading) return <Typography align="center" sx={{ mt: 10 }} color="text.secondary">Loading movies...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Movies Featuring {actor}
            </Typography>
            {Object.entries(movies).map(([actorName, movieList]) => (
                <Card key={actorName} sx={{ my: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>{actorName}</Typography>
                        <List>
                            {movieList.map((movie) => (
                                <ListItem key={movie}>
                                    <ListItemText primary={movie} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default MoviesPage;
