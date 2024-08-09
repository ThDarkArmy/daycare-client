import React from 'react';
import { Typography, Button, Container, Grid, Paper, TextField, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    hero: {
        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_68GGxJsL_Q_dvAMONRisBWbA3nbH-LSDGg&s)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
    },
    section: {
        padding: '50px 0',
        marginTop: "10px",
    },
    featureCard: {
        padding: '20px',
        textAlign: 'left',
    }
}));

const LandingPage = () => {
    const classes = useStyles();

    return (
        <>
            <Box className={classes.hero}>
                <Container>
                    <Typography variant="h2">Welcome to Our Daycare</Typography>
                    <Typography variant="h5">Where learning meets fun. Providing a nurturing environment for your child's growth and happiness.</Typography>
                    <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>Learn More</Button>
                </Container>
            </Box>
            
            <Container className={classes.section}>
                <Typography variant="h4" gutterBottom>About Us</Typography>
                <Typography paragraph>
                    Our daycare center offers a safe, fun, and educational environment for your children. We believe in fostering a community where children can grow, learn, and play. With a dedicated team of qualified caregivers, we ensure that each child receives the attention and support they need.
                </Typography>
                <Typography paragraph>
                    At our daycare, we understand the importance of early childhood education. Our curriculum is designed to promote cognitive, emotional, and social development through a variety of engaging activities. From storytelling and arts and crafts to outdoor play and educational games, we provide a well-rounded experience that nurtures your child's natural curiosity and creativity.
                </Typography>
                <Typography paragraph>
                    We also prioritize safety and cleanliness, ensuring that our facilities are always up to the highest standards. Join us and be part of a community that cares deeply about your child's well-being and development.
                </Typography>
            </Container>
            
            <Container className={classes.section}>
                <Typography variant="h4" gutterBottom>Our Features</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.featureCard}>
                            <Typography variant="h6">Qualified Staff</Typography>
                            <Typography>Our team consists of certified and experienced caregivers and educators. Each staff member is passionate about early childhood development and dedicated to providing the best care for your children.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.featureCard}>
                            <Typography variant="h6">Engaging Activities</Typography>
                            <Typography>We offer a wide range of activities designed to stimulate your child's mind and body. Our daily schedule includes storytelling, music and dance, arts and crafts, outdoor play, and educational games.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.featureCard}>
                            <Typography variant="h6">Safe Environment</Typography>
                            <Typography>Safety is our top priority. Our facilities are equipped with secure entry systems, and we maintain strict hygiene standards. We conduct regular safety drills and inspections to ensure that our daycare is a safe space.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default LandingPage;
