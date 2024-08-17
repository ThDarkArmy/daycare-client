import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography,  Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';



const BASE_URL = "http://100.27.196.227/api/v1";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '50px',
        marginTop: 80,

    },
    formContainer: {
        padding: '30px',
        border: "0px solid black",
        maxWidth: "450px",
        backgroundColor: "silver",
    },
    textField: {
        marginTop: "20px",
    },
    buttonContainer: {
        display: 'flex',
        marginTop: "10px",
    },
    paymentConatiner: {
        padding: "20px",
        width: "400px",
        border: "1px solid black",
    }
}));


const Admission = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const param = useParams();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login-register")
        }
    }, [])

    const [kidData, setKidData] = useState({
        name: "",
        age: "",
        sex: "",
        address: "",
        contact: ""
    })

    const [kidId, setKidId] = useState("");

    const [kidDataError, setKidDataError] = useState({
        name: "",
        age: "",
        sex: "",
        address: "",
        contact: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKidData(prev => ({ ...prev, [name]: value }))
        setKidDataError(prev => ({ ...prev, [name]: "" }))
    }


    const validate = () => {
        let tempErrors = {};
        if (!kidData.name) tempErrors.name = "Name is required";
        if (!kidData.sex) tempErrors.sex = "Sex is required";
        if (!kidData.address) tempErrors.address = "Address is required";
        if (!kidData.age) tempErrors.age = "Age is required";
        else if (isNaN(kidData.age) || kidData.age <= 0) tempErrors.age = "Age must be a positive number";
        if (!kidData.contact) tempErrors.contact = "Parent contact is required";
        if(!kidData.contact.match(/^[6-9]\d{9}$/)) tempErrors.contact = "Please enter a valid contact number";
        else if (!/^\d{10}$/.test(kidData.contact)) tempErrors.contact = "Parent contact must be a 10-digit number";

        setKidDataError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const response = await axios({
                    method: "post",
                    url: BASE_URL + `/kids/${param.id}`,
                    data: JSON.stringify(kidData),
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.data) {
                    setKidId(response.data.id)
                    toast.success("Kid admitted successfully, please proceed with the payment.")

                }
            } catch (err) {
                toast.error("Some error occurred while submitting admission form!")
                console.error(err)
            }
        }
    }

    const handleSubmitPaymentForm = async () => {
        if(paymentFormValidate()){
            try {
                const paymentData = {
                    admissionFee: 5000,
                    tuitionFee: 2000,
                    culturalActivityFee: 500,
                    otherFee: 500,
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear()
                }
                const response = await axios({
                    method: "post",
                    url: BASE_URL + "/fee-payment/" + kidId,
                    data: JSON.stringify(paymentData),
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });
    
                if (response.data) {
                    toast.success("Fee payment successful")
                    navigate("/kids-dashboard")
                }
            } catch (err) {
                toast.error("Some error occurred while paying fee!")
                console.error(err)
            }
        }
       
    }

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateExpiryDate = (expiryDate) => {
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expiryDatePattern.test(expiryDate)) {
            return false; // Invalid format
        }

        const [expMonth, expYear] = expiryDate.split('/');
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-based, so we add 1
        const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2)); // Get last 2 digits of current year

        const expMonthInt = parseInt(expMonth, 10);
        const expYearInt = parseInt(expYear, 10);

        if (expYearInt > currentYear || (expYearInt === currentYear && expMonthInt >= currentMonth)) {
            return true; // Not expired
        }
        return false; // Expired
    };

    const paymentFormValidate = () => {
        let formErrors = {};
        const cardNumberPattern = /^\d{16}$/;
        const cvvPattern = /^\d{3}$/;
        const expiryDatePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

        if (!formData.cardNumber || !cardNumberPattern.test(formData.cardNumber)) {
            formErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!formData.cardHolder) {
            formErrors.cardHolder = 'Cardholder name is required';
        }

        if (!formData.expiryDate || !validateExpiryDate(formData.expiryDate)) {
            formErrors.expiryDate = 'Expiry date is invalid or card is expired';
        }

        if (!formData.cvv || !cvvPattern.test(formData.cvv)) {
            formErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (paymentFormValidate()) {
            setOpen(false);
            toast.success("Payment Successful!")
        }
    };

    return (
        <Box className={classes.container}>
            <Box className={classes.formContainer}>
                <Typography>Admission Form</Typography>
                <TextField
                    fullWidth
                    name="name"
                    size='small'
                    label="Name"
                    className={classes.textField}
                    value={kidData.name}
                    onChange={handleChange}
                    error={!!kidDataError.name}
                    helperText={kidDataError.name}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    name="age"
                    size='small'
                    label="Age"
                    type="number"
                    className={classes.textField}
                    value={kidData.age}
                    onChange={handleChange}
                    error={!!kidDataError.age}
                    helperText={kidDataError.age}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal" error={!!kidDataError.sex}>
                    <InputLabel>Sex</InputLabel>
                    <Select
                        fullWidth
                        name="sex"
                        size='small'
                        value={kidData.sex}
                        onChange={handleChange}
                        error={!!kidDataError.sex}
                        helperText={kidDataError.sex}
                        margin="normal"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {kidDataError.sex && <span style={{ color: "red", textAlign: "left", fontSize: "13px", marginLeft: "10px" }}>{kidDataError.sex}</span>}
                </FormControl>

                <TextField
                    fullWidth
                    name="address"
                    size='small'
                    label="Address"
                    className={classes.textField}
                    value={kidData.address}
                    onChange={handleChange}
                    error={!!kidDataError.address}
                    helperText={kidDataError.address}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    name="contact"
                    size='small'
                    label="Contact Number"
                    className={classes.textField}
                    value={kidData.contact}
                    onChange={handleChange}
                    error={!!kidDataError.contact}
                    helperText={kidDataError.contact}
                    margin="normal"
                />
                <Box className={classes.buttonContainer}>
                    <Button fullWidth variant='outlined'>Cancel</Button>
                    <Button onClick={() => handleSubmit()} fullWidth variant='contained' sx={{ ml: 1 }}>Submit</Button>
                </Box>

            </Box>

            <Box>
                <Box className={classes.paymentConatiner}>
                    <span style={{ color: "red", fontSize: "22px", fontWeight: 600 }}>Fee Structure</span>
                    <Divider sx={{ bgcolor: "red" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Admission Fee: </span>
                        <span>5000 </span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Tuition Fee: </span>
                        <span>2000 </span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Cultural Activity Fee: </span>
                        <span>500 </span>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Other Fee: </span>
                        <span>500 </span>
                    </Box>
                    <Divider sx={{ bgcolor: "black", mt: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <span>Total Amount: </span>
                        <span>8000 </span>
                    </Box>
                    <Button onClick={()=> setOpen(true)} disabled={!kidId} fullWidth variant='contained' sx={{ mt: 2 }}>Pay 8000</Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: 1, mt: 2 }}>
                    <span style={{color: "green"}}>Click on the below link to avail the 10% offer on admission fee.</span>
                    <Button  onClick={()=> {window.open('https://docs.google.com/forms/d/e/1FAIpQLSf94XKUj8OihX17vg2RCkAbuWhbCbMC1gO0H3aRL7Mg59DYEQ/viewform?usp=sf_link', '_blank');}} sx={{marginTop: 1}}>Link</Button>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Payment Information</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handlePaymentFormChange}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    inputProps={{ maxLength: 16 }}
                                    placeholder="1234 5678 9101 1121"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    name="cardHolder"
                                    value={formData.cardHolder}
                                    onChange={handlePaymentFormChange}
                                    error={!!errors.cardHolder}
                                    helperText={errors.cardHolder}
                                    placeholder="John Doe"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handlePaymentFormChange}
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                    placeholder="MM/YY"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="CVV"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handlePaymentFormChange}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                    inputProps={{ maxLength: 3 }}
                                    placeholder="123"
                                    type="password"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitPaymentForm} color="primary">
                        Pay Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Admission