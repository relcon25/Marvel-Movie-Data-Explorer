import React from "react";
import { useActors } from "../hooks/useActors";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";

const ActorsPage = () => {
    const { actors, loading, error } = useActors();
    const navigate = useNavigate();

    if (loading) return <Typography align="center" sx={{ mt: 10 }} color="text.secondary">Loading actors...</Typography>;
    if (error) return <Typography align="center" sx={{ mt: 10 }} color="error">Error: {error}</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Marvel Actors
            </Typography>
            <Grid container spacing={3}>
                {actors.map((actor) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={actor}>
                        <Card>
                            <CardActionArea onClick={() => navigate(`/movies/${actor}`)}>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        {actor}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ActorsPage;
