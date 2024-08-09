import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, Grid } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuildingCard from '../components/BuildingCard';

const BASE_URL = "http://localhost:8000/api/v1";

const Home = () => {

  const [buildings, setBuildings] = useState([]);
  const [buildingsToDisplay, setBuildingsToDisplay] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {

    loadBuildings();
  }, [])

  const loadBuildings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/buildings`);
      if (response.data) {
        setBuildings(response.data);
        setBuildingsToDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const buildingsToDisplay = buildings.filter(building => building.name.toLowerCase().includes(searchText.toLowerCase()));
    console.log(buildingsToDisplay)
    setBuildingsToDisplay(buildingsToDisplay)
  }, [searchText])

  return (
    <>
      <Header />
      <Box sx={{ mt: -2, maxWidth: "100%" }}>
        <video width="100%" id="HomeV" muted loop autoPlay>
          <source src={require('../video/background.mp4')} type="video/mp4" ></source>
        </video>
        <div style={{ marginTop: 10, padding: 20 }}>

          <Box sx={{ mt: 2, padding: 1 }} id="shop">
            <TextField onChange={(e) => setSearchText(e.target.value)} fullWidth placeholder="Search" />
          </Box>
          <Box sx={{mt: 7, p: 1}}>
          <Grid container spacing={3}>
            {buildingsToDisplay
              .map((building) => (
                <Grid item key={building.id}>
                  <BuildingCard
                    building={building}
                  />
                </Grid>
              ))}
          </Grid>
          </Box>
          
        </div>
      </Box>
    </>
  )
}

export default Home